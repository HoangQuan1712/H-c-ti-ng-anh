// Firebase Configuration & Service Module (Full Auth, Cloud Firestore & Analytics)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// User's Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCoCH02SCTc_ors0S7BJMSsrGZNayp4g7k",
  authDomain: "tienganh-b5bdc.firebaseapp.com",
  projectId: "tienganh-b5bdc",
  storageBucket: "tienganh-b5bdc.firebasestorage.app",
  messagingSenderId: "200409903334",
  appId: "1:200409903334:web:11eec0c0657a338eb14b27",
  measurementId: "G-CHPQPTKY7W"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics safely
export let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
    console.log("[Firebase] Analytics initialized successfully.");
  }
}).catch(err => {
  console.warn("[Firebase] Analytics initialization notice:", err.message);
});

// Firebase Cloud Authentication & Firestore Sync Service
export const firebaseService = {
  // 1. Register User Account directly in Firebase Authentication & Firestore
  async registerWithFirebase(name, email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // Update Firebase Auth Display Name
      await updateProfile(fbUser, { displayName: name });

      const defaultAvatarPreset = "avatar_" + ((Math.abs(email.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 10) + 1);
      const userDocData = {
        id: fbUser.uid,
        name: name,
        email: email,
        username: email.split("@")[0],
        birthday: "",
        address: "",
        education: "Người đi làm",
        createdAt: new Date().toISOString(),
        avatarColor: "#06B6D4",
        avatarPreset: defaultAvatarPreset,
        avatarImage: null,
        skillLevels: { writing: "A2", listening: "B1", reading: "B1", speaking: "A2" },
        learningGoal: "communication",
        learningGoals: ["communication"],
        isOnboarded: false
      };

      // Save user profile document to Cloud Firestore collection "users"
      await setDoc(doc(db, "users", fbUser.uid), userDocData, { merge: true });
      console.log(`[Firebase Auth] Registered user "${email}" (UID: ${fbUser.uid})`);

      return userDocData;
    } catch (err) {
      console.warn("[Firebase Auth] Register notice:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        throw new Error("Email này đã được đăng ký tài khoản trên hệ thống Firebase.");
      } else if (err.code === "auth/weak-password") {
        throw new Error("Mật khẩu phải có độ dài tối thiểu 6 ký tự.");
      } else if (err.code === "auth/invalid-email") {
        throw new Error("Địa chỉ email không đúng định dạng.");
      }
      throw err;
    }
  },

  // 2. Login User with Firebase Authentication
  async loginWithFirebase(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;

      // Fetch user profile document from Firestore "users"
      const userRef = doc(db, "users", fbUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const userData = snap.data();
        console.log(`[Firebase Auth] Logged in "${email}" successfully.`);
        return userData;
      }

      // If document does not exist yet, build from Firebase Auth profile
      const fallbackUser = {
        id: fbUser.uid,
        name: fbUser.displayName || email.split("@")[0],
        email: email,
        username: email.split("@")[0],
        birthday: "",
        address: "",
        education: "Người đi làm",
        createdAt: new Date().toISOString(),
        avatarColor: "#06B6D4",
        avatarPreset: "avatar_1",
        avatarImage: null,
        skillLevels: { writing: "A2", listening: "B1", reading: "B1", speaking: "A2" },
        learningGoal: "communication",
        learningGoals: ["communication"],
        isOnboarded: true
      };

      await setDoc(userRef, fallbackUser, { merge: true });
      return fallbackUser;
    } catch (err) {
      console.warn("[Firebase Auth] Login notice:", err.code, err.message);
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        throw new Error("Email hoặc mật khẩu không chính xác.");
      } else if (err.code === "auth/invalid-email") {
        throw new Error("Địa chỉ email không đúng định dạng.");
      }
      throw err;
    }
  },

  // 3. Update User Profile in Firebase Auth & Cloud Firestore
  async updateUserProfileInFirebase(userId, updates) {
    if (!userId || !db) return false;
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        ...updates,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      if (auth.currentUser && updates.name) {
        await updateProfile(auth.currentUser, { displayName: updates.name });
      }
      console.log(`[Firebase Cloud] Updated profile for UID ${userId}`);
      return true;
    } catch (err) {
      console.warn("[Firebase Cloud] Update profile notice:", err.message);
      return false;
    }
  },

  // 4. Sync All Learning Progress (Streak, Essays, Vocab, Saved Articles) to Firestore collection "users_data"
  async syncUserDataToCloud(userId, data) {
    if (!userId || !db) return false;
    try {
      const userRef = doc(db, "users_data", userId);
      await setDoc(userRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn("[Firebase Cloud] Sync learning data notice:", err.message);
      return false;
    }
  },

  // 5. Load User Learning Progress from Firestore
  async loadUserDataFromCloud(userId) {
    if (!userId || !db) return null;
    try {
      const userRef = doc(db, "users_data", userId);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
    } catch (err) {
      console.warn("[Firebase Cloud] Fetch learning data notice:", err.message);
    }
    return null;
  },

  // 6. Sign Out
  async logout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("[Firebase Auth] Signout notice:", err.message);
    }
  }
};
