// FluentActive Local Backend Server & Database Manager
// Built with native Node.js (No external dependencies required)
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DB_DIR = path.join(__dirname, 'database');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const USER_DATA_FILE = path.join(DB_DIR, 'user_data.json');
const GROUPS_FILE = path.join(DB_DIR, 'groups.json');
const GROUP_MESSAGES_FILE = path.join(DB_DIR, 'group_messages.json');

// Default Study Groups
const DEFAULT_GROUPS = [
  {
    id: "grp_business",
    name: "💼 Business & Tech English",
    tagline: "Tiếng Anh công sở, đàm phán, email & phỏng vấn công nghệ",
    category: "business",
    level: "B1 - C1",
    activeMembers: 18,
    dailyTopic: "Product Launch & Agile Sprint Retrospective",
    targetWords: [
      { word: "leverage", pos: "v", meaning: "tận dụng, đòn bẩy", example: "We can leverage AI to automate user onboarding." },
      { word: "streamline", pos: "v", meaning: "tối ưu hóa quy trình", example: "Let's streamline the approval process." },
      { word: "feasible", pos: "adj", meaning: "khả thi", example: "Is this deadline technically feasible?" },
      { word: "bottleneck", pos: "n", meaning: "điểm nghẽn, trở ngại", example: "Code review is currently the biggest bottleneck." },
      { word: "stakeholder", pos: "n", meaning: "các bên liên quan", example: "We must align with key stakeholders first." }
    ]
  },
  {
    id: "grp_ielts",
    name: "🎯 IELTS 7.0+ Master Squad",
    tagline: "Luyện Speaking Part 2/3 & từ vựng học thuật C1",
    category: "ielts",
    level: "B2 - C1",
    activeMembers: 24,
    dailyTopic: "Environmental Sustainability & Technological Impact",
    targetWords: [
      { word: "ubiquitous", pos: "adj", meaning: "phổ biến khắp nơi", example: "Smartphones have become ubiquitous in modern life." },
      { word: "detrimental", pos: "adj", meaning: "có hại, gây bất lợi", example: "Pollution has a detrimental effect on biodiversity." },
      { word: "mitigate", pos: "v", meaning: "giảm thiểu tác động", example: "We need urgent policies to mitigate climate change." },
      { word: "compelling", pos: "adj", meaning: "thuyết phục, hấp dẫn", example: "She presented a compelling argument for renewable energy." },
      { word: "paradigm", pos: "n", meaning: "mô hình, khuôn mẫu", example: "Remote work caused a major shift in the work paradigm." }
    ]
  },
  {
    id: "grp_daily_chat",
    name: "☕ Daily Coffee Talk & Fluency",
    tagline: "Giao tiếp tự nhiên, đời sống, phim ảnh & phản xạ hàng ngày",
    category: "communication",
    level: "A2 - B2",
    activeMembers: 32,
    dailyTopic: "Travel Experiences & Weekend Hobbies",
    targetWords: [
      { word: "breathtaking", pos: "adj", meaning: "đẹp ngỡ ngàng, ngoạn mục", example: "The mountain view at sunrise was truly breathtaking." },
      { word: "unwind", pos: "v", meaning: "thư giãn, xả hơi", example: "I love reading a book to unwind after a hectic day." },
      { word: "wanderlust", pos: "n", meaning: "niềm đam mê du lịch", example: "Her wanderlust inspired her to visit over 20 countries." },
      { word: "spontaneous", pos: "adj", meaning: "ngẫu hứng, tự phát", example: "We took a spontaneous road trip to the coast." },
      { word: "recharge", pos: "v", meaning: "nạp lại năng lượng", example: "A weekend in nature helps me recharge my batteries." }
    ]
  },
  {
    id: "grp_study_abroad",
    name: "🎓 Study Abroad & Relocation",
    tagline: "Tiếng Anh học thuật, đời sống du học & thích nghi văn hóa",
    category: "study_abroad",
    level: "B1 - B2",
    activeMembers: 15,
    dailyTopic: "University Campus Life & Accommodation Hunt",
    targetWords: [
      { word: "adaptable", pos: "adj", meaning: "dễ thích nghi", example: "International students must be resilient and adaptable." },
      { word: "curfew", pos: "n", meaning: "giờ giới nghiêm", example: "The dormitory has a strict 11 PM curfew." },
      { word: "orientation", pos: "n", meaning: "buổi định hướng tân sinh viên", example: "Don't miss the campus orientation this Thursday." },
      { word: "scholarship", pos: "n", meaning: "học bổng", example: "She earned a merit-based scholarship for her master's." },
      { word: "culture shock", pos: "n", meaning: "sốc văn hóa", example: "Experiencing culture shock is a normal part of moving abroad." }
    ]
  }
];

// Initial mock chat messages
const DEFAULT_MESSAGES = {
  "grp_business": [
    {
      id: "msg_1",
      senderId: "bot_ai",
      senderName: "🤖 Fluent AI Moderator",
      senderAvatar: "#8B5CF6",
      text: "Chào mừng các bạn đến với phòng Business & Tech English! 🚀 Thử thách hôm nay: Hãy đặt câu hoặc trò chuyện sử dụng ít nhất 1 từ trong danh sách [leverage, streamline, feasible, bottleneck, stakeholder] để nhận điểm thưởng!",
      time: "08:00",
      isAi: true
    },
    {
      id: "msg_2",
      senderId: "u_sample_1",
      senderName: "Minh Quân (Tech Lead)",
      senderAvatar: "#06B6D4",
      text: "Hi everyone! In our sprint today, we managed to streamline our deployment pipeline, which was a huge bottleneck previously.",
      time: "08:15",
      appliedWords: ["streamline", "bottleneck"]
    },
    {
      id: "msg_3",
      senderId: "bot_ai",
      senderName: "🤖 Fluent AI Moderator",
      senderAvatar: "#8B5CF6",
      text: "🎉 Xuất sắc @Minh Quân! Bạn đã áp dụng chính xác 2 từ: 'streamline' & 'bottleneck' (+20 EXP).",
      time: "08:15",
      isAi: true
    }
  ],
  "grp_ielts": [
    {
      id: "msg_ielts_1",
      senderId: "bot_ai",
      senderName: "🤖 Fluent AI Moderator",
      senderAvatar: "#8B5CF6",
      text: "Welcome to IELTS 7.0+ Master Squad! Hôm nay chúng ta luyện Speaking Part 3 về chủ đề Môi Trường với 5 từ vựng học thuật C1.",
      time: "08:00",
      isAi: true
    }
  ],
  "grp_daily_chat": [
    {
      id: "msg_daily_1",
      senderId: "bot_ai",
      senderName: "🤖 Fluent AI Moderator",
      senderAvatar: "#8B5CF6",
      text: "Chào cả nhà! Hôm nay mọi người có kế hoạch gì để unwind sau giờ học/làm việc không? Hãy cùng chia sẻ nhé!",
      time: "08:00",
      isAi: true
    }
  ],
  "grp_study_abroad": [
    {
      id: "msg_abroad_1",
      senderId: "bot_ai",
      senderName: "🤖 Fluent AI Moderator",
      senderAvatar: "#8B5CF6",
      text: "Welcome to Study Abroad room! Share your university application experiences and visa tips here.",
      time: "08:00",
      isAi: true
    }
  ]
};

// Ensure database directory and initial files exist
function initDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }

  if (!fs.existsSync(USER_DATA_FILE)) {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify({}, null, 2), 'utf-8');
  }

  if (!fs.existsSync(GROUPS_FILE)) {
    fs.writeFileSync(GROUPS_FILE, JSON.stringify(DEFAULT_GROUPS, null, 2), 'utf-8');
  }

  if (!fs.existsSync(GROUP_MESSAGES_FILE)) {
    fs.writeFileSync(GROUP_MESSAGES_FILE, JSON.stringify(DEFAULT_MESSAGES, null, 2), 'utf-8');
  }
}

initDatabase();

// Helper database reader / writer functions
function readJsonFile(filePath, fallback = []) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content || (Array.isArray(fallback) ? '[]' : '{}'));
  } catch (err) {
    console.error(`[DB Read Error] ${filePath}:`, err.message);
    return fallback;
  }
}

function writeJsonFile(filePath, data) {
  try {
    const tempFile = filePath + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, filePath);
    return true;
  } catch (err) {
    console.error(`[DB Write Error] ${filePath}:`, err.message);
    return false;
  }
}

// MIME Types for Static File Serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Parse JSON Body Helper
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  const payload = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(payload);
}

// Request Handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // --- REST API ROUTES ---

  // 1. GET /api/db-status
  if (pathname === '/api/db-status' && method === 'GET') {
    const users = readJsonFile(USERS_FILE, []);
    return sendJson(res, 200, {
      status: 'online',
      message: 'FluentActive Database Connected',
      userCount: users.length,
      timestamp: new Date().toISOString()
    });
  }

  // 2. POST /api/register
  if (pathname === '/api/register' && method === 'POST') {
    try {
      const { name, email, password } = await parseBody(req);

      if (!name || !email || !password) {
        return sendJson(res, 400, {
          success: false,
          error: 'Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu.'
        });
      }

      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (cleanPassword.length < 6) {
        return sendJson(res, 400, {
          success: false,
          error: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.'
        });
      }

      const users = readJsonFile(USERS_FILE, []);
      const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (existing) {
        return sendJson(res, 409, {
          success: false,
          error: 'Email này đã được đăng ký tài khoản. Vui lòng chuyển sang tab Đăng Nhập.'
        });
      }

      const avatarColors = ['#06B6D4', '#8B5CF6', '#10B981', '#F43F5E', '#F59E0B'];
      const defaultSkillLevels = {
        writing: "A2",
        listening: "B1",
        reading: "B1",
        speaking: "A2"
      };

      const newUser = {
        id: 'u_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        name: cleanName,
        email: cleanEmail,
        username: cleanEmail.split('@')[0],
        birthday: "",
        address: "",
        education: "Người đi làm",
        password: cleanPassword,
        createdAt: new Date().toISOString().slice(0, 10),
        avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
        avatarPreset: "avatar_1",
        skillLevels: defaultSkillLevels,
        learningGoal: "communication",
        isOnboarded: false
      };

      users.push(newUser);
      writeJsonFile(USERS_FILE, users);

      // Initialize user activity data
      const userData = readJsonFile(USER_DATA_FILE, {});
      if (!userData[newUser.id]) {
        userData[newUser.id] = {
          dailyProgress: {
            date: new Date().toISOString().slice(0, 10),
            skills: { writing: false, listening: false, reading: false, speaking: false }
          },
          streak: { count: 1, lastActiveDate: new Date().toISOString().slice(0, 10) },
          essays: [],
          vocab: [],
          speakingUsage: { date: new Date().toISOString().slice(0, 10), usageMap: {} }
        };
        writeJsonFile(USER_DATA_FILE, userData);
      }

      console.log(`[DB Register] User created: ${newUser.name} (${newUser.email})`);

      const { password: _, ...publicUser } = newUser;
      return sendJson(res, 201, {
        success: true,
        message: 'Đăng ký tài khoản thành công!',
        user: publicUser
      });
    } catch (err) {
      console.error('[DB Register Error]:', err);
      return sendJson(res, 500, { success: false, error: 'Lỗi máy chủ khi đăng ký: ' + err.message });
    }
  }

  // 3. POST /api/login
  if (pathname === '/api/login' && method === 'POST') {
    try {
      const { email, password } = await parseBody(req);

      if (!email || !password) {
        return sendJson(res, 400, {
          success: false,
          error: 'Vui lòng nhập đầy đủ Email và Mật khẩu.'
        });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const users = readJsonFile(USERS_FILE, []);
      const user = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        return sendJson(res, 404, {
          success: false,
          error: 'Tài khoản với email này không tồn tại. Vui lòng đăng ký tài khoản mới.'
        });
      }

      if (user.password !== cleanPassword) {
        return sendJson(res, 401, {
          success: false,
          error: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.'
        });
      }

      console.log(`[DB Login] User logged in: ${user.name} (${user.email})`);

      const { password: _, ...publicUser } = user;
      return sendJson(res, 200, {
        success: true,
        message: 'Đăng nhập thành công!',
        user: publicUser
      });
    } catch (err) {
      console.error('[DB Login Error]:', err);
      return sendJson(res, 500, { success: false, error: 'Lỗi máy chủ khi đăng nhập: ' + err.message });
    }
  }

  // 4. PUT /api/user-profile (Update User Profile, Avatar, Levels, Goal)
  if (pathname === '/api/user-profile' && method === 'PUT') {
    try {
      const { userId, updates } = await parseBody(req);
      if (!userId || !updates) {
        return sendJson(res, 400, { success: false, error: 'userId và updates là bắt buộc.' });
      }

      const users = readJsonFile(USERS_FILE, []);
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return sendJson(res, 404, { success: false, error: 'Không tìm thấy người dùng.' });
      }

      // Check email uniqueness if email is changed
      if (updates.email) {
        const newEmail = updates.email.trim().toLowerCase();
        const conflict = users.find(u => u.email.toLowerCase() === newEmail && u.id !== userId);
        if (conflict) {
          return sendJson(res, 409, { success: false, error: 'Email này đã được người khác sử dụng.' });
        }
        updates.email = newEmail;
      }

      // Merge allowed profile fields
      const allowedFields = [
        'name', 'email', 'username', 'birthday', 'address', 
        'education', 'avatarColor', 'avatarPreset', 'skillLevels', 
        'learningGoal', 'isOnboarded'
      ];

      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          users[userIndex][field] = updates[field];
        }
      });

      writeJsonFile(USERS_FILE, users);
      console.log(`[DB Profile] Updated profile for user ${users[userIndex].name}`);

      const { password: _, ...publicUser } = users[userIndex];
      return sendJson(res, 200, {
        success: true,
        message: 'Cập nhật thông tin tài khoản thành công!',
        user: publicUser
      });
    } catch (err) {
      console.error('[DB Profile Error]:', err);
      return sendJson(res, 500, { success: false, error: 'Lỗi khi cập nhật hồ sơ: ' + err.message });
    }
  }

  // 5. POST /api/change-password
  if (pathname === '/api/change-password' && method === 'POST') {
    try {
      const { userId, oldPassword, newPassword } = await parseBody(req);
      if (!userId || !oldPassword || !newPassword) {
        return sendJson(res, 400, { success: false, error: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.' });
      }

      if (newPassword.trim().length < 6) {
        return sendJson(res, 400, { success: false, error: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' });
      }

      const users = readJsonFile(USERS_FILE, []);
      const user = users.find(u => u.id === userId);

      if (!user) {
        return sendJson(res, 404, { success: false, error: 'Người dùng không tồn tại.' });
      }

      if (user.password !== oldPassword.trim()) {
        return sendJson(res, 401, { success: false, error: 'Mật khẩu hiện tại không chính xác.' });
      }

      user.password = newPassword.trim();
      writeJsonFile(USERS_FILE, users);
      console.log(`[DB Auth] Password changed for user ${user.name}`);

      return sendJson(res, 200, { success: true, message: 'Đổi mật khẩu thành công!' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: 'Lỗi khi đổi mật khẩu: ' + err.message });
    }
  }

  // 6. GET /api/user-data?userId=...
  if (pathname === '/api/user-data' && method === 'GET') {
    const userId = parsedUrl.query.userId;
    if (!userId) {
      return sendJson(res, 400, { success: false, error: 'userId is required' });
    }

    const userData = readJsonFile(USER_DATA_FILE, {});
    const data = userData[userId] || {
      dailyProgress: {
        date: new Date().toISOString().slice(0, 10),
        skills: { writing: false, listening: false, reading: false, speaking: false }
      },
      streak: { count: 1, lastActiveDate: new Date().toISOString().slice(0, 10) },
      essays: [],
      vocab: [],
      speakingUsage: { date: new Date().toISOString().slice(0, 10), usageMap: {} }
    };

    return sendJson(res, 200, { success: true, data });
  }

  // 7. POST /api/user-data
  if (pathname === '/api/user-data' && method === 'POST') {
    try {
      const { userId, data } = await parseBody(req);
      if (!userId || !data) {
        return sendJson(res, 400, { success: false, error: 'userId and data are required' });
      }

      const userData = readJsonFile(USER_DATA_FILE, {});
      userData[userId] = {
        ...(userData[userId] || {}),
        ...data,
        updatedAt: new Date().toISOString()
      };

      writeJsonFile(USER_DATA_FILE, userData);
      return sendJson(res, 200, { success: true, message: 'Dữ liệu đã được lưu vào Database!' });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: 'Lỗi khi lưu dữ liệu người dùng: ' + err.message });
    }
  }

  // 8. GET /api/groups (List study groups)
  if (pathname === '/api/groups' && method === 'GET') {
    const groups = readJsonFile(GROUPS_FILE, DEFAULT_GROUPS);
    return sendJson(res, 200, { success: true, groups });
  }

  // 9. GET /api/groups/messages?groupId=... (Get chat messages for a group)
  if (pathname === '/api/groups/messages' && method === 'GET') {
    const groupId = parsedUrl.query.groupId || 'grp_business';
    const allMessages = readJsonFile(GROUP_MESSAGES_FILE, DEFAULT_MESSAGES);
    const messages = allMessages[groupId] || [];
    return sendJson(res, 200, { success: true, groupId, messages });
  }

  // 10. POST /api/groups/messages (Send message to a group)
  if (pathname === '/api/groups/messages' && method === 'POST') {
    try {
      const { groupId, senderId, senderName, senderAvatar, text } = await parseBody(req);
      if (!groupId || !text || !senderName) {
        return sendJson(res, 400, { success: false, error: 'groupId, senderName và text là bắt buộc.' });
      }

      const allMessages = readJsonFile(GROUP_MESSAGES_FILE, DEFAULT_MESSAGES);
      if (!allMessages[groupId]) allMessages[groupId] = [];

      // Check for target vocabulary in the group
      const groups = readJsonFile(GROUPS_FILE, DEFAULT_GROUPS);
      const currentGroup = groups.find(g => g.id === groupId);
      const appliedWords = [];

      if (currentGroup && Array.isArray(currentGroup.targetWords)) {
        const lowerText = text.toLowerCase();
        currentGroup.targetWords.forEach(tw => {
          if (lowerText.includes(tw.word.toLowerCase())) {
            appliedWords.push(tw.word);
          }
        });
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      const newMsg = {
        id: 'msg_' + Date.now(),
        senderId: senderId || 'user_guest',
        senderName: senderName || 'Member',
        senderAvatar: senderAvatar || '#06B6D4',
        text: text.trim(),
        time: timeStr,
        appliedWords: appliedWords.length > 0 ? appliedWords : undefined
      };

      allMessages[groupId].push(newMsg);

      // AI Moderator response if applied words
      let aiResponseMsg = null;
      if (appliedWords.length > 0) {
        const wordsListStr = appliedWords.map(w => `'${w}'`).join(', ');
        aiResponseMsg = {
          id: 'msg_ai_' + Date.now(),
          senderId: 'bot_ai',
          senderName: '🤖 Fluent AI Moderator',
          senderAvatar: '#8B5CF6',
          text: `🎉 Tuyệt vời @${senderName}! Bạn đã áp dụng thành công ${appliedWords.length} từ vựng mục tiêu hôm nay: ${wordsListStr} (+${appliedWords.length * 10} EXP).`,
          time: timeStr,
          isAi: true
        };
        allMessages[groupId].push(aiResponseMsg);
      }

      writeJsonFile(GROUP_MESSAGES_FILE, allMessages);

      return sendJson(res, 201, {
        success: true,
        message: newMsg,
        aiResponse: aiResponseMsg
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 11. POST /api/sync-all
  if (pathname === '/api/sync-all' && method === 'POST') {
    try {
      const { localUsers, localUserData } = await parseBody(req);
      const users = readJsonFile(USERS_FILE, []);
      const userData = readJsonFile(USER_DATA_FILE, {});
      let importedCount = 0;

      if (Array.isArray(localUsers)) {
        for (const u of localUsers) {
          if (u.email && !users.some(x => x.email.toLowerCase() === u.email.toLowerCase())) {
            users.push(u);
            importedCount++;
          }
        }
        writeJsonFile(USERS_FILE, users);
      }

      if (localUserData && typeof localUserData === 'object') {
        Object.assign(userData, localUserData);
        writeJsonFile(USER_DATA_FILE, userData);
      }

      return sendJson(res, 200, {
        success: true,
        importedCount,
        totalUsers: users.length
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // --- STATIC FILE SERVING ---
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 FluentActive Local Server & Database Online!`);
  console.log(`🌐 Local Web: http://localhost:${PORT}/`);
  console.log(`📁 Database:  ${DB_DIR}`);
  console.log(`=======================================================`);
});
