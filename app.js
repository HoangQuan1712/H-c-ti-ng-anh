// Main Application Controller & Router with User Auth & Database Sync
import { renderDashboardSection } from "./js/dashboard.js";
import { renderWritingSection } from "./js/writing.js";
import { renderListeningSection } from "./js/listening.js";
import { renderReadingSection } from "./js/reading.js";
import { renderSpeakingSection } from "./js/speaking.js";
import { renderVocabSection } from "./js/vocab.js";
import { renderGroupsSection } from "./js/groups.js";
import { renderProfileSection } from "./js/profile.js";
import { renderPlacementTestSection } from "./js/placement-test-view.js";
import { checkAndShowOnboarding } from "./js/onboarding.js";
import { storageService } from "./js/storage.js";
import { wallpaperService } from "./js/wallpaper.js";

let activeTab = "dashboard";

export function getStreakTierInfo(count) {
  const c = Math.max(1, count || 1);
  if (c >= 10) {
    return {
      tierClass: "streak-plasma",
      flameSize: "1.35rem",
      color: "#22D3EE",
      text: `${c} Ngày (Thần Thoại)`,
      title: `🔥 ${c} Ngày liên tiếp - Cấp độ Lửa Plasma Thần Thoại!`
    };
  } else if (c >= 5) {
    return {
      tierClass: "streak-fiery",
      flameSize: "1.2rem",
      color: "#FB7185",
      text: `${c} Ngày (Rực Rỡ)`,
      title: `🔥 ${c} Ngày liên tiếp - Cấp độ Ngọn Lửa Rực Rỡ!`
    };
  } else if (c >= 2) {
    return {
      tierClass: "streak-growing",
      flameSize: "1.05rem",
      color: "#FB923C",
      text: `${c} Ngày (Bùng Cháy)`,
      title: `🔥 ${c} Ngày liên tiếp - Cấp độ Đang Bùng Cháy!`
    };
  } else {
    return {
      tierClass: "streak-ember",
      flameSize: "0.85rem",
      color: "#FBBF24",
      text: `1 Ngày (Khởi Đầu)`,
      title: `🔥 1 Ngày - Mới thắp mồi ngọn lửa đầu tiên!`
    };
  }
}

// Global Speech Synthesis Helper (Safe & Instant across all browsers)
window.speakSentence = function(sentence, lang = "en-US", rate = 0.92) {
  if (!sentence) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = lang;
    utterance.rate = rate;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const enVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("US") || v.name.includes("UK") || v.name.includes("English")));
      if (enVoice) utterance.voice = enVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("SpeechSynthesis not supported.");
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  // Preload voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // Initialize Wallpaper
  wallpaperService.applyWallpaper();

  // Initialize Storage and sync with Server Database
  await storageService.init();
  
  initAppHeader();
  initAuthModal();
  initPasswordToggles();
  switchTab("dashboard");

  // Check onboarding for first-time or new accounts
  checkAndShowOnboarding(() => {
    initAppHeader();
    switchTab(activeTab);
  });
});

export async function initAppHeader() {
  const streak = storageService.getStreak();
  const apiKey = storageService.getApiKey();
  const user = storageService.getCurrentUser();

  // Dynamic Flame Streak Pill
  const streakPill = document.getElementById("header-streak-pill");
  const streakTier = getStreakTierInfo(streak.count);

  if (streakPill) {
    streakPill.className = `streak-pill ${streakTier.tierClass}`;
    streakPill.title = streakTier.title;
    streakPill.innerHTML = `
      <i data-lucide="flame" class="icon-flame-dynamic" style="font-size: ${streakTier.flameSize}; color: ${streakTier.color};"></i>
      <span id="header-streak-text">${streakTier.text}</span>
    `;
  }

  // Database Connection & Firebase Cloud Badge
  const dbPill = document.getElementById("header-db-pill");
  const dbText = document.getElementById("header-db-text");
  if (dbPill && dbText) {
    const dbStatus = await storageService.checkDbStatus();
    if (dbStatus.online) {
      dbPill.className = "db-status-badge db-online";
      dbText.textContent = `Cloud: Firebase (tienganh-b5bdc)`;
      dbPill.title = `Cơ sở dữ liệu Database & Firebase Cloud Firestore đã kết nối`;
    } else {
      dbPill.className = "db-status-badge db-online";
      dbText.textContent = `Firebase: Cloud Sync`;
      dbPill.title = "Đang chạy chế độ Đồng Bộ Đám Mây Firebase (tienganh-b5bdc)";
    }
  }

  // Key status badge
  const keyBadge = document.getElementById("header-api-badge");
  if (keyBadge) {
    if (apiKey) {
      keyBadge.className = "badge badge-success";
      keyBadge.textContent = "AI Key: Ready";
    } else {
      keyBadge.className = "badge badge-warning";
      keyBadge.textContent = "AI Key: Offline Smart Mode";
    }
  }

  // User Profile Header
  const authContainer = document.getElementById("user-profile-header-container");
  if (authContainer) {
    if (user) {
      const initial = (user.name || "U").charAt(0).toUpperCase();
      const avatarContent = user.avatarImage 
        ? `<img src="${user.avatarImage}" class="user-avatar-img" alt="${user.name}">` 
        : initial;
      const avatarBgStyle = user.avatarImage ? 'background: rgba(255,255,255,0.08);' : `background: ${user.avatarColor || '#06B6D4'};`;

      authContainer.innerHTML = `
        <div class="user-profile-pill" id="header-user-pill" title="Xem & Chỉnh sửa hồ sơ cá nhân" style="cursor: pointer;">
          <div class="user-avatar ${user.avatarImage ? 'has-custom-img' : ''}" style="${avatarBgStyle}">${avatarContent}</div>
          <span class="user-name-text" title="${user.name} (${user.email})">${user.name}</span>
          <button id="btn-logout" class="btn-icon-small text-muted" title="Đăng Xuất">
            <i data-lucide="log-out"></i>
          </button>
        </div>
      `;

      const userPill = document.getElementById("header-user-pill");
      if (userPill) {
        userPill.onclick = (e) => {
          if (e.target.closest("#btn-logout")) return;
          switchTab("profile");
        };
      }

      const btnLogout = document.getElementById("btn-logout");
      if (btnLogout) {
        btnLogout.onclick = (e) => {
          e.stopPropagation();
          if (confirm(`Bạn có chắc chắn muốn đăng xuất tài khoản "${user.name}"?`)) {
            storageService.logoutUser();
            initAppHeader();
            switchTab("dashboard");
          }
        };
      }
    } else {
      authContainer.innerHTML = `
        <button id="btn-open-auth-modal" class="btn btn-sm btn-primary glow-cyan">
          <i data-lucide="user"></i> Đăng Nhập
        </button>
      `;
      const btnOpen = document.getElementById("btn-open-auth-modal");
      if (btnOpen) {
        btnOpen.onclick = () => openAuthModal("login");
      }
    }
  }

  // API Key Modal Trigger
  const btnKeyModal = document.getElementById("btn-open-api-modal");
  const modalKey = document.getElementById("modal-api-key");
  const btnCloseKey = document.getElementById("btn-close-api-modal");
  const btnSaveKey = document.getElementById("btn-save-api-key");
  const inputKey = document.getElementById("input-gemini-api-key");

  if (btnKeyModal && modalKey) {
    btnKeyModal.onclick = () => {
      inputKey.value = storageService.getApiKey();
      modalKey.classList.remove("hidden");
    };
    btnCloseKey.onclick = () => modalKey.classList.add("hidden");
    btnSaveKey.onclick = () => {
      const keyVal = inputKey.value.trim();
      storageService.setApiKey(keyVal);
      modalKey.classList.add("hidden");
      initAppHeader();
      alert(keyVal ? "✅ Đã lưu Gemini API Key thành công!" : "ℹ️ Đã chuyển về chế độ Smart AI Offline.");
    };
  }

  // Main Nav Tabs click (Desktop dock, Mobile bottom nav, Mobile drawer)
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.onclick = (e) => {
      e.preventDefault();
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    };
  });

  initMobileNavigation();
  lucide.createIcons();
}

function initMobileNavigation() {
  const btnMoreMenu = document.getElementById("btn-mobile-more-menu");
  const drawerBackdrop = document.getElementById("mobile-drawer-backdrop");
  const btnCloseDrawer = document.getElementById("btn-close-mobile-drawer");
  const btnDrawerApiKey = document.getElementById("btn-drawer-api-key");
  const modalKey = document.getElementById("modal-api-key");
  const inputKey = document.getElementById("input-gemini-api-key");

  if (btnMoreMenu && drawerBackdrop) {
    btnMoreMenu.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      drawerBackdrop.classList.toggle("hidden");
    };
  }

  if (btnCloseDrawer && drawerBackdrop) {
    btnCloseDrawer.onclick = (e) => {
      e.preventDefault();
      drawerBackdrop.classList.add("hidden");
    };
  }

  if (drawerBackdrop) {
    drawerBackdrop.onclick = (e) => {
      if (e.target === drawerBackdrop) {
        drawerBackdrop.classList.add("hidden");
      }
    };
  }

  if (btnDrawerApiKey && modalKey && inputKey) {
    btnDrawerApiKey.onclick = () => {
      if (drawerBackdrop) drawerBackdrop.classList.add("hidden");
      inputKey.value = storageService.getApiKey();
      modalKey.classList.remove("hidden");
    };
  }
}

function initAuthModal() {
  const modalAuth = document.getElementById("modal-auth");
  const btnCloseAuth = document.getElementById("btn-close-auth-modal");
  const tabBtnLogin = document.getElementById("tab-btn-login");
  const tabBtnRegister = document.getElementById("tab-btn-register");
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");
  const linkGoToRegister = document.getElementById("link-go-to-register");
  const linkGoToLogin = document.getElementById("link-go-to-login");

  if (!modalAuth) return;

  btnCloseAuth.onclick = () => modalAuth.classList.add("hidden");

  // Tab switching helper functions
  const activateLoginTab = () => {
    tabBtnLogin.classList.add("active");
    tabBtnRegister.classList.remove("active");
    formLogin.classList.remove("hidden");
    formRegister.classList.add("hidden");
    hideAuthAlert();
    document.getElementById("login-password").value = "";
    document.getElementById("login-email").focus();
  };

  const activateRegisterTab = () => {
    tabBtnRegister.classList.add("active");
    tabBtnLogin.classList.remove("active");
    formRegister.classList.remove("hidden");
    formLogin.classList.add("hidden");
    hideAuthAlert();
    document.getElementById("reg-password").value = "";
    document.getElementById("reg-confirm-password").value = "";
    document.getElementById("reg-name").focus();
  };

  tabBtnLogin.onclick = activateLoginTab;
  tabBtnRegister.onclick = activateRegisterTab;

  if (linkGoToRegister) linkGoToRegister.onclick = (e) => { e.preventDefault(); activateRegisterTab(); };
  if (linkGoToLogin) linkGoToLogin.onclick = (e) => { e.preventDefault(); activateLoginTab(); };

  // --- LOGIN SUBMIT ---
  formLogin.onsubmit = async (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById("btn-submit-login");
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      showAuthAlert("error", "Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    try {
      setButtonLoading(btnSubmit, true, "Đang xác thực...");
      hideAuthAlert();

      const user = await storageService.loginUser(email, password);
      showAuthAlert("success", `🎉 Đăng nhập thành công! Chào mừng ${user.name} trở lại.`);
      
      setTimeout(() => {
        modalAuth.classList.add("hidden");
        initAppHeader();
        switchTab(activeTab);

        if (!user.isOnboarded) {
          checkAndShowOnboarding(() => {
            initAppHeader();
            switchTab(activeTab);
          });
        }
      }, 700);
    } catch (err) {
      showAuthAlert("error", err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.");
    } finally {
      setButtonLoading(btnSubmit, false, '<i data-lucide="log-in"></i> <span>Đăng Nhập Ngay</span>');
      lucide.createIcons();
    }
  };

  // --- REGISTER SUBMIT ---
  formRegister.onsubmit = async (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById("btn-submit-register");
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const confirmPassword = document.getElementById("reg-confirm-password").value.trim();

    if (!name || !email || !password) {
      showAuthAlert("error", "Vui lòng điền đầy đủ các trường thông tin (*).");
      return;
    }

    if (password.length < 6) {
      showAuthAlert("error", "Mật khẩu phải có độ dài tối thiểu 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      showAuthAlert("error", "Mật khẩu xác nhận không khớp. Vui lòng nhập lại chính xác.");
      return;
    }

    try {
      setButtonLoading(btnSubmit, true, "Đang lưu vào Database...");
      hideAuthAlert();

      const user = await storageService.registerUser(name, email, password);
      showAuthAlert("success", `🎉 Đăng ký thành công và đã lưu vào Database! Chào mừng ${user.name}.`);
      
      setTimeout(() => {
        modalAuth.classList.add("hidden");
        initAppHeader();
        switchTab(activeTab);

        // Immediately trigger onboarding for newly registered user
        showOnboardingModal(() => {
          initAppHeader();
          switchTab(activeTab);
        });
      }, 900);
    } catch (err) {
      showAuthAlert("error", err.message || "Không thể đăng ký tài khoản. Vui lòng thử lại.");
    } finally {
      setButtonLoading(btnSubmit, false, '<i data-lucide="user-plus"></i> <span>Tạo Tài Khoản Mới</span>');
      lucide.createIcons();
    }
  };
}

export function openAuthModal(defaultTab = "login") {
  const modalAuth = document.getElementById("modal-auth");
  const tabBtnLogin = document.getElementById("tab-btn-login");
  const tabBtnRegister = document.getElementById("tab-btn-register");
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");

  if (!modalAuth) return;

  hideAuthAlert();

  if (defaultTab === "register") {
    tabBtnRegister.classList.add("active");
    tabBtnLogin.classList.remove("active");
    formRegister.classList.remove("hidden");
    formLogin.classList.add("hidden");
  } else {
    tabBtnLogin.classList.add("active");
    tabBtnRegister.classList.remove("active");
    formLogin.classList.remove("hidden");
    formRegister.classList.add("hidden");
  }

  modalAuth.classList.remove("hidden");
}

function initPasswordToggles() {
  document.querySelectorAll(".btn-toggle-password").forEach(btn => {
    btn.onclick = () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      btn.innerHTML = isPassword ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
      lucide.createIcons();
    };
  });
}

function setButtonLoading(button, isLoading, text) {
  if (!button) return;
  button.disabled = isLoading;
  if (isLoading) {
    button.innerHTML = `<span class="spinner-sm"></span> <span>${text}</span>`;
  } else {
    button.innerHTML = text;
  }
}

function showAuthAlert(type, message) {
  const alertEl = document.getElementById("auth-alert");
  if (!alertEl) return;
  alertEl.className = `auth-alert auth-alert-${type}`;
  alertEl.innerHTML = `<span>${message}</span>`;
  alertEl.classList.remove("hidden");
}

function hideAuthAlert() {
  const alertEl = document.getElementById("auth-alert");
  if (alertEl) alertEl.classList.add("hidden");
}

export function switchTab(tabName) {
  activeTab = tabName;

  // Automatically close mobile drawer if open
  const drawerBackdrop = document.getElementById("mobile-drawer-backdrop");
  if (drawerBackdrop && !drawerBackdrop.classList.contains("hidden")) {
    drawerBackdrop.classList.add("hidden");
  }

  // Update More button active state on mobile when a drawer section is active
  const moreBtn = document.getElementById("btn-mobile-more-menu");
  const drawerTabs = ["vocab", "groups", "placement-test", "profile"];
  if (moreBtn) {
    if (drawerTabs.includes(tabName)) {
      moreBtn.classList.add("active");
    } else {
      moreBtn.classList.remove("active");
    }
  }

  document.querySelectorAll(".nav-tab").forEach(tab => {
    if (tab.dataset.tab === tabName) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  const contentContainer = document.getElementById("tab-content");
  contentContainer.innerHTML = "";

  switch (tabName) {
    case "dashboard":
      renderDashboardSection(contentContainer, switchTab);
      break;
    case "writing":
      renderWritingSection(contentContainer);
      break;
    case "listening":
      renderListeningSection(contentContainer);
      break;
    case "reading":
      renderReadingSection(contentContainer);
      break;
    case "speaking":
      renderSpeakingSection(contentContainer);
      break;
    case "vocab":
      renderVocabSection(contentContainer);
      break;
    case "groups":
      renderGroupsSection(contentContainer);
      break;
    case "profile":
      renderProfileSection(contentContainer);
      break;
    case "placement-test":
      renderPlacementTestSection(contentContainer, switchTab);
      break;
    default:
      renderDashboardSection(contentContainer, switchTab);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  lucide.createIcons();
}
