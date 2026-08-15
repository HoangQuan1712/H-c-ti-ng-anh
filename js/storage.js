// LocalStorage & Database API Storage Service Manager with Firebase Cloud Sync
// Hybrid Architecture: Persistent JSON Database Server + Firebase Cloud Firestore + Instant Local Cache
import { firebaseService } from "./firebase-config.js";

const KEYS = {
  USERS: "fluentactive_users_db",
  CURRENT_USER: "fluentactive_current_user",
  API_KEY: "fluentactive_gemini_key",
  USER_DATA_CACHE: "fluentactive_user_data_cache"
};

// Memory Cache for current active session
let inMemoryUserData = null;
let isServerOnline = false;
let syncTimeout = null;

export const storageService = {
  // --- Server Health & Initialization ---
  async checkDbStatus() {
    try {
      const res = await fetch("/api/db-status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        isServerOnline = true;
        return { online: true, userCount: data.userCount };
      }
    } catch {
      isServerOnline = false;
    }
    return { online: false, userCount: this.getUsers().length };
  },

  async init() {
    await this.checkDbStatus();
    const currentUser = this.getCurrentUser();
    if (currentUser && isServerOnline) {
      await this.loadUserDataFromServer(currentUser.id);
    }
    // Auto-migrate any local-only users to server DB if server is up
    this.migrateLocalUsersToServer();
  },

  async migrateLocalUsersToServer() {
    if (!isServerOnline) return;
    try {
      const localUsers = this.getUsers();
      if (localUsers.length > 0) {
        await fetch("/api/sync-all", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ localUsers })
        });
      }
    } catch (e) {
      console.warn("[Storage] Migration notice:", e.message);
    }
  },

  // --- User Auth & Accounts ---
  getUsers() {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
  },

  getCurrentUser() {
    const saved = localStorage.getItem(KEYS.CURRENT_USER);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
      inMemoryUserData = null;
    }
  },

  logoutUser() {
    this.setCurrentUser(null);
    firebaseService.logout();
  },

  // Asynchronous Database & Firebase Registration
  async registerUser(name, email, password) {
    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      throw new Error("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
    }
    if (cleanPassword.length < 6) {
      throw new Error("Mật khẩu phải có độ dài tối thiểu 6 ký tự.");
    }

    let newUser = null;

    // 1. Primary: Register on Firebase Authentication & Cloud Firestore
    try {
      newUser = await firebaseService.registerWithFirebase(cleanName, cleanEmail, cleanPassword);
    } catch (fbErr) {
      console.warn("[Storage] Firebase Auth notice:", fbErr.message);
      if (fbErr.message.includes("Email này đã được đăng ký")) {
        throw fbErr;
      }
    }

    // 2. Also Sync to Local Server Database if online
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: cleanName, 
          email: cleanEmail, 
          password: cleanPassword,
          firebaseUid: newUser?.id
        })
      });

      const result = await response.json();
      if (response.ok && result.user) {
        if (!newUser) newUser = result.user;
        isServerOnline = true;
      }
    } catch {
      // Local server offline notice
    }

    // 3. Fallback to Local Store if both remote and local servers were unavailable
    if (!newUser) {
      const users = this.getUsers();
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        throw new Error("Email này đã được đăng ký tài khoản. Vui lòng đăng nhập.");
      }

      newUser = {
        id: "u_" + Date.now(),
        name: cleanName,
        email: cleanEmail,
        username: cleanEmail.split('@')[0],
        birthday: "",
        address: "",
        education: "Người đi làm",
        password: cleanPassword,
        createdAt: new Date().toISOString().slice(0, 10),
        avatarColor: ["#06B6D4", "#8B5CF6", "#10B981", "#F43F5E", "#F59E0B"][Math.floor(Math.random() * 5)],
        avatarPreset: "avatar_1",
        avatarImage: null,
        skillLevels: { writing: "A2", listening: "B1", reading: "B1", speaking: "A2" },
        learningGoal: "communication",
        isOnboarded: false
      };
    }

    // 4. Update Local Storage Cache
    const users = this.getUsers();
    const existingIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (existingIdx !== -1) {
      users[existingIdx] = { ...users[existingIdx], ...newUser, password: cleanPassword };
    } else {
      users.push({ ...newUser, password: cleanPassword });
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    // 5. Set Current Active User
    this.setCurrentUser(newUser);
    return newUser;
  },

  // Asynchronous Database & Firebase Login
  async loginUser(email, password) {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error("Vui lòng nhập đầy đủ Email và Mật khẩu.");
    }

    let loggedInUser = null;

    // 1. Primary: Login with Firebase Authentication & Firestore
    try {
      loggedInUser = await firebaseService.loginWithFirebase(cleanEmail, cleanPassword);
    } catch (fbErr) {
      console.warn("[Storage] Firebase Login notice:", fbErr.message);
      if (fbErr.message.includes("Email hoặc mật khẩu không chính xác")) {
        // Continue to check local store in case user was registered offline
      }
    }

    // 2. Fallback to Local Server Database
    if (!loggedInUser) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
        });

        const result = await response.json();
        if (response.ok && result.user) {
          loggedInUser = result.user;
          isServerOnline = true;
        }
      } catch {
        // Local server offline notice
      }
    }

    // 3. Fallback to Local Storage
    if (!loggedInUser) {
      const users = this.getUsers();
      const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);

      if (!found) {
        throw new Error("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
      }

      loggedInUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        username: found.username || found.email.split('@')[0],
        birthday: found.birthday || "",
        address: found.address || "",
        education: found.education || "Người đi làm",
        createdAt: found.createdAt,
        avatarColor: found.avatarColor,
        avatarPreset: found.avatarPreset || "avatar_1",
        avatarImage: found.avatarImage || null,
        skillLevels: found.skillLevels || { writing: "A2", listening: "B1", reading: "B1", speaking: "A2" },
        learningGoal: found.learningGoal || "communication",
        isOnboarded: found.isOnboarded || false
      };
    }

    // 4. Set Current Active User
    this.setCurrentUser(loggedInUser);

    // 5. Fetch & sync User Activity Data from Database & Firebase Cloud
    await this.loadUserDataFromServer(loggedInUser.id);

    return loggedInUser;
  },

  // --- Update User Profile (Name, Email, Birthday, Address, Education, Avatar, Levels, Goal) ---
  async updateUserProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) throw new Error("Chưa đăng nhập.");

    const mergedUser = { ...user, ...updates };

    // 1. Sync to Firebase Cloud Firestore collection "users"
    firebaseService.updateUserProfileInFirebase(user.id, updates);

    // 2. Sync to Local Server Database if available
    try {
      await fetch("/api/user-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, updates })
      });
    } catch {
      // Local server offline notice
    }

    // 3. Update Local Storage Cache
    this.setCurrentUser(mergedUser);
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }

    return mergedUser;
  },

  // --- Change Password ---
  async changePassword(oldPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) throw new Error("Chưa đăng nhập.");

    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, oldPassword, newPassword })
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Không thể đổi mật khẩu.");
    }
    return result;
  },

  // --- Skill Levels & Learning Goal Helpers ---
  getUserSkillLevels() {
    const user = this.getCurrentUser();
    return user?.skillLevels || {
      writing: "B1",
      listening: "B1",
      reading: "B1",
      speaking: "A2"
    };
  },

  getUserLearningGoals() {
    const user = this.getCurrentUser();
    if (!user) return ["communication"];
    if (Array.isArray(user.learningGoals) && user.learningGoals.length > 0) {
      return user.learningGoals;
    }
    if (user.learningGoal) {
      return [user.learningGoal];
    }
    return ["communication"];
  },

  getUserLearningGoal() {
    return this.getUserLearningGoals()[0] || "communication";
  },

  // --- Study Groups & Chat ---
  async getGroups() {
    try {
      const res = await fetch("/api/groups");
      const json = await res.json();
      return json.groups || [];
    } catch {
      return [];
    }
  },

  async getGroupMessages(groupId) {
    try {
      const res = await fetch(`/api/groups/messages?groupId=${encodeURIComponent(groupId)}`);
      const json = await res.json();
      return json.messages || [];
    } catch {
      return [];
    }
  },

  async sendGroupMessage(groupId, text) {
    const user = this.getCurrentUser() || {
      id: "guest_" + Date.now(),
      name: "Khách Học Viên",
      avatarColor: "#06B6D4"
    };

    const res = await fetch("/api/groups/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatarColor,
        senderAvatarImage: user.avatarImage || "",
        text
      })
    });

    return await res.json();
  },

  // --- Backend & Firebase Cloud Data Sync ---
  async loadUserDataFromServer(userId) {
    let cloudData = null;

    // 1. Try local server database first
    try {
      const res = await fetch(`/api/user-data?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          cloudData = json.data;
        }
      }
    } catch {
      // Local server is offline (e.g. deployed on GitHub Pages)
    }

    // 2. Fallback to Firebase Cloud Firestore if local server is unreachable
    if (!cloudData) {
      cloudData = await firebaseService.loadUserDataFromCloud(userId);
    }

    if (cloudData) {
      inMemoryUserData = cloudData;
      if (cloudData.dailyProgress) {
        localStorage.setItem(this.getUserKey("daily_progress"), JSON.stringify(cloudData.dailyProgress));
      }
      if (cloudData.streak) {
        localStorage.setItem(this.getUserKey("streak_data"), JSON.stringify(cloudData.streak));
      }
      if (cloudData.essays) {
        localStorage.setItem(this.getUserKey("essays"), JSON.stringify(cloudData.essays));
      }
      if (cloudData.vocab) {
        localStorage.setItem(this.getUserKey("vocab_notebook"), JSON.stringify(cloudData.vocab));
      }
      if (cloudData.speakingUsage) {
        localStorage.setItem(this.getUserKey("speaking_logs"), JSON.stringify(cloudData.speakingUsage));
      }
      if (cloudData.savedArticles) {
        localStorage.setItem(this.getUserKey("saved_reading_articles"), JSON.stringify(cloudData.savedArticles));
      }
    }
  },

  triggerServerSave() {
    const user = this.getCurrentUser();
    if (!user) return;

    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
      const payloadData = {
        dailyProgress: this.getDailyProgress(),
        streak: this.getStreak(),
        essays: this.getEssays(),
        vocab: this.getVocab(),
        speakingUsage: this.getSpeakingUsage(),
        savedArticles: this.getSavedArticles()
      };

      // 1. Sync to local server database if available
      try {
        await fetch("/api/user-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, data: payloadData })
        });
      } catch (err) {
        // Local server offline notice
      }

      // 2. Sync to Firebase Cloud Firestore (tienganh-b5bdc)
      try {
        await firebaseService.syncUserDataToCloud(user.id, payloadData);
      } catch (err) {
        console.warn("[Firebase Cloud] Auto-sync notice:", err.message);
      }
    }, 300);
  },

  // Helper key generator scoped per user
  getUserKey(suffix) {
    const user = this.getCurrentUser();
    const prefix = user ? `user_${user.id}_` : "guest_";
    return `fluentactive_${prefix}${suffix}`;
  },

  // --- API Key ---
  getApiKey() {
    return localStorage.getItem(KEYS.API_KEY) || "";
  },
  setApiKey(key) {
    localStorage.setItem(KEYS.API_KEY, key.trim());
  },

  // --- Daily Streak & Progress ---
  getDailyProgress() {
    const today = new Date().toISOString().slice(0, 10);
    const key = this.getUserKey("daily_progress");
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    if (data.date !== today) {
      const newProgress = {
        date: today,
        skills: { writing: false, listening: false, reading: false, speaking: false }
      };
      localStorage.setItem(key, JSON.stringify(newProgress));
      this.triggerServerSave();
      return newProgress;
    }
    return data;
  },

  markSkillCompleted(skillName) {
    const progress = this.getDailyProgress();
    if (progress.skills && progress.skills[skillName] !== undefined) {
      progress.skills[skillName] = true;
      const key = this.getUserKey("daily_progress");
      localStorage.setItem(key, JSON.stringify(progress));
      this.updateStreak();
      this.triggerServerSave();
    }
    return progress;
  },

  getStreak() {
    const defaultStreak = { count: 1, lastActiveDate: new Date().toISOString().slice(0, 10) };
    const key = this.getUserKey("streak_data");
    const saved = localStorage.getItem(key);
    if (!saved) return defaultStreak;
    try {
      return JSON.parse(saved);
    } catch {
      return defaultStreak;
    }
  },

  updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const streak = this.getStreak();
    if (streak.lastActiveDate === today) return streak;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (streak.lastActiveDate === yesterdayStr) {
      streak.count += 1;
    } else {
      streak.count = 1;
    }
    streak.lastActiveDate = today;
    const key = this.getUserKey("streak_data");
    localStorage.setItem(key, JSON.stringify(streak));
    this.triggerServerSave();
    return streak;
  },

  // --- Essays ---
  getEssays() {
    const key = this.getUserKey("essays");
    return JSON.parse(localStorage.getItem(key) || "[]");
  },
  saveEssay(essay) {
    const essays = this.getEssays();
    const newEssay = {
      id: "essay_" + Date.now(),
      date: new Date().toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      ...essay
    };
    essays.unshift(newEssay);
    const key = this.getUserKey("essays");
    localStorage.setItem(key, JSON.stringify(essays));
    this.markSkillCompleted("writing");
    this.triggerServerSave();
    return newEssay;
  },
  deleteEssay(id) {
    let essays = this.getEssays();
    essays = essays.filter(e => e.id !== id);
    const key = this.getUserKey("essays");
    localStorage.setItem(key, JSON.stringify(essays));
    this.triggerServerSave();
    return essays;
  },

  // --- Vocabulary Notebook ---
  getVocab() {
    const key = this.getUserKey("vocab_notebook");
    return JSON.parse(localStorage.getItem(key) || "[]");
  },
  saveWord(wordObj) {
    const vocab = this.getVocab();
    if (vocab.some(item => item.word.toLowerCase() === wordObj.word.toLowerCase())) {
      return false;
    }
    vocab.unshift({
      id: "v_" + Date.now(),
      word: wordObj.word,
      pos: wordObj.pos || "n",
      meaning: wordObj.meaning || "",
      phonetic: wordObj.phonetic || "",
      example: wordObj.example || "",
      savedAt: new Date().toISOString().slice(0, 10)
    });
    const key = this.getUserKey("vocab_notebook");
    localStorage.setItem(key, JSON.stringify(vocab));
    this.triggerServerSave();
    return true;
  },
  deleteWord(id) {
    let vocab = this.getVocab();
    vocab = vocab.filter(item => item.id !== id);
    const key = this.getUserKey("vocab_notebook");
    localStorage.setItem(key, JSON.stringify(vocab));
    this.triggerServerSave();
    return vocab;
  },

  // --- Speaking Logs ---
  getSpeakingUsage() {
    const today = new Date().toISOString().slice(0, 10);
    const key = this.getUserKey("speaking_logs");
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    if (data.date !== today) {
      return { date: today, usageMap: {} };
    }
    return data;
  },

  logSpeakingUsage(patternId) {
    const data = this.getSpeakingUsage();
    data.usageMap[patternId] = (data.usageMap[patternId] || 0) + 1;
    const key = this.getUserKey("speaking_logs");
    localStorage.setItem(key, JSON.stringify(data));
    this.markSkillCompleted("speaking");
    this.triggerServerSave();
    return data;
  },

  // --- Saved Reading Articles ---
  getSavedArticles() {
    const key = this.getUserKey("saved_reading_articles");
    return JSON.parse(localStorage.getItem(key) || "[]");
  },

  isArticleSaved(articleId) {
    if (!articleId) return false;
    const list = this.getSavedArticles();
    return list.some(a => a.id === articleId);
  },

  saveReadingArticle(article) {
    if (!article || !article.id) return false;
    const list = this.getSavedArticles();
    const existingIndex = list.findIndex(a => a.id === article.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...article, savedAt: new Date().toISOString() };
    } else {
      list.unshift({
        id: article.id,
        title: article.title,
        category: article.category,
        readTime: article.readTime,
        content: article.content,
        discussionStarter: article.discussionStarter,
        vocabulary: article.vocabulary || [],
        savedAt: new Date().toISOString()
      });
    }
    const key = this.getUserKey("saved_reading_articles");
    localStorage.setItem(key, JSON.stringify(list));
    this.triggerServerSave();
    return true;
  },

  removeSavedArticle(articleId) {
    if (!articleId) return false;
    let list = this.getSavedArticles();
    list = list.filter(a => a.id !== articleId);
    const key = this.getUserKey("saved_reading_articles");
    localStorage.setItem(key, JSON.stringify(list));
    this.triggerServerSave();
    return true;
  }
};
