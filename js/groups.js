// Study Groups, Live Group Chat & Interactive Video Call Studio Controller
import { storageService } from "./storage.js";

let currentActiveGroupId = "grp_business";
let activeMediaStream = null;
let isMicMuted = false;
let isCamOff = false;
let isScreenSharing = false;

export async function renderGroupsSection(container) {
  const groups = await storageService.getGroups();
  const user = storageService.getCurrentUser() || { name: "Bạn", avatarColor: "#06B6D4" };

  container.innerHTML = `
    <div class="groups-section-wrapper fade-in">
      <!-- Section Header -->
      <div class="groups-hero glass-card mb-xl">
        <div class="groups-hero-content">
          <div class="hero-tag-badge glow-purple"><i data-lucide="users"></i> Cộng Đồng Học Tập Tương Tác</div>
          <h2 class="hero-title">Nhóm Học & Luyện Tiếng Anh Cùng Nhau</h2>
          <p class="hero-desc">Tham gia vào các nhóm học theo mục tiêu, ứng dụng ngay danh sách <strong>5 từ vựng thử thách hôm nay</strong> vào trò chuyện thực tế hoặc bật phòng <strong>Gọi Video Trực Tuyến</strong> để đối thoại cùng bạn học & AI Partner.</p>
        </div>
      </div>

      <!-- Groups Main Layout Grid -->
      <div class="groups-grid-layout">
        <!-- Left Sidebar: Group List Selector -->
        <div class="groups-sidebar-panel glass-card">
          <div class="panel-header">
            <h4><i data-lucide="compass"></i> Chọn Nhóm Học</h4>
            <span class="badge badge-outline">${groups.length} Phòng</span>
          </div>

          <div class="groups-nav-list" id="groups-nav-list">
            ${groups.map(grp => `
              <div class="group-nav-item ${grp.id === currentActiveGroupId ? 'active-group' : ''}" data-group-id="${grp.id}">
                <div class="group-nav-top">
                  <span class="group-nav-name">${grp.name}</span>
                  <span class="group-nav-level">${grp.level}</span>
                </div>
                <p class="group-nav-tagline">${grp.tagline}</p>
                <div class="group-nav-footer">
                  <span><i data-lucide="users"></i> ${grp.activeMembers} đang online</span>
                  <span class="active-indicator"></span>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right Main Panel: Active Group Room -->
        <div class="group-room-main glass-card" id="group-room-container">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </div>

    <!-- Video Call Studio Modal -->
    <div id="modal-video-studio" class="modal-backdrop hidden" style="z-index: 300;">
      <div class="modal-content glass-card video-studio-box fade-in">
        <div class="video-studio-header">
          <div class="studio-title-box">
            <span class="live-dot-pulse"></span>
            <h3 id="video-room-title">Phòng Luyện Nói Video Trực Tuyến</h3>
            <span class="badge badge-success">HD Audio & Video</span>
          </div>
          <button id="btn-close-video-modal" class="modal-close"><i data-lucide="x"></i></button>
        </div>

        <!-- Target Words Live Bar inside Video Call -->
        <div class="video-target-words-bar" id="video-target-words-bar">
          <span class="bar-title"><i data-lucide="sparkles"></i> Từ vựng mục tiêu cần dùng trong cuộc gọi:</span>
          <div class="words-pill-list" id="video-words-pills"></div>
        </div>

        <!-- Video Grids View (Local Camera & AI Partner / Remote) -->
        <div class="video-grid-view">
          <!-- Local User Camera -->
          <div class="video-card local-video-card">
            <video id="local-video-element" autoplay playsinline muted></video>
            <div class="video-placeholder" id="local-video-placeholder">
              <div class="avatar-large-circle ${user.avatarImage ? 'has-custom-img' : ''}" style="${user.avatarImage ? 'background: rgba(255,255,255,0.08);' : `background: ${user.avatarColor || '#06B6D4'}`}">
                ${user.avatarImage ? `<img src="${user.avatarImage}" class="avatar-circle-img" alt="${user.name}">` : (user.name || "U").charAt(0)}
              </div>
              <p class="text-muted small mt-sm">Camera đang tắt</p>
            </div>
            <div class="video-user-badge">
              <i data-lucide="user"></i> <span>Bạn (${user.name})</span>
              <span id="local-audio-indicator" class="audio-dot active"></span>
            </div>
          </div>

          <!-- Remote / AI Partner Camera -->
          <div class="video-card remote-video-card">
            <div class="partner-avatar-view">
              <div class="partner-avatar-glow" style="background: linear-gradient(135deg, #8B5CF6, #06B6D4)">
                <i data-lucide="bot"></i>
              </div>
              <h4 class="partner-name">Emma (AI Speaking Partner)</h4>
              <p class="partner-status text-muted small">Đang lắng nghe & sẵn sàng đối thoại</p>
              <!-- Animated Waveform -->
              <div class="voice-waveform active-wave">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div class="video-user-badge">
              <i data-lucide="bot"></i> <span>Emma (Partner)</span>
              <span class="audio-dot active"></span>
            </div>
          </div>
        </div>

        <!-- Video Studio Controls Toolbar -->
        <div class="video-studio-toolbar">
          <button id="btn-toggle-mic" class="studio-btn" title="Bật/Tắt Micro">
            <i data-lucide="mic"></i> <span>Mic</span>
          </button>
          <button id="btn-toggle-cam" class="studio-btn" title="Bật/Tắt Camera">
            <i data-lucide="video"></i> <span>Camera</span>
          </button>
          <button id="btn-toggle-share" class="studio-btn" title="Chia sẻ màn hình">
            <i data-lucide="screen-share"></i> <span>Màn hình</span>
          </button>
          <button id="btn-end-call" class="studio-btn studio-btn-end" title="Rời phòng gọi">
            <i data-lucide="phone-off"></i> <span>Kết thúc</span>
          </button>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();

  // Attach group list selection click
  container.querySelectorAll(".group-nav-item").forEach(item => {
    item.onclick = () => {
      container.querySelectorAll(".group-nav-item").forEach(i => i.classList.remove("active-group"));
      item.classList.add("active-group");
      currentActiveGroupId = item.dataset.groupId;
      renderActiveGroupRoom(container);
    };
  });

  // Render the current active group room
  renderActiveGroupRoom(container);
  initVideoStudioEvents();
}

async function renderActiveGroupRoom(container) {
  const roomContainer = container.querySelector("#group-room-container");
  if (!roomContainer) return;

  const groups = await storageService.getGroups();
  const currentGroup = groups.find(g => g.id === currentActiveGroupId) || groups[0];
  const messages = await storageService.getGroupMessages(currentGroup.id);
  const user = storageService.getCurrentUser() || { name: "Bạn", avatarColor: "#06B6D4" };

  roomContainer.innerHTML = `
    <!-- Active Room Header -->
    <div class="room-top-header">
      <div class="room-title-area">
        <h3 class="room-title">${currentGroup.name}</h3>
        <p class="room-topic-text"><i data-lucide="message-square"></i> Chủ đề hôm nay: <strong>${currentGroup.dailyTopic}</strong></p>
      </div>
      <div class="room-header-actions">
        <button id="btn-launch-video-call" class="btn btn-primary glow-purple btn-sm">
          <i data-lucide="video"></i> Tham Gia Gọi Video
        </button>
      </div>
    </div>

    <!-- 2 Column Room Layout: Left Challenge Target Words | Right Chat Box -->
    <div class="room-content-split">
      <!-- Target Words Box -->
      <div class="target-words-panel">
        <div class="target-words-header">
          <h5><i data-lucide="flame" class="icon-cyan"></i> 5 Từ Vựng Thử Thách Hôm Nay</h5>
          <small class="text-muted">Áp dụng vào câu chat để nhận điểm EXP!</small>
        </div>

        <div class="target-words-list">
          ${(currentGroup.targetWords || []).map((w, idx) => `
            <div class="target-word-card" data-word="${w.word}">
              <div class="word-card-top">
                <span class="word-num">#${idx + 1}</span>
                <strong class="word-name">${w.word}</strong>
                <span class="word-pos">(${w.pos})</span>
                <button type="button" class="btn-insert-word" title="Chèn vào ô chat"><i data-lucide="plus-circle"></i></button>
              </div>
              <p class="word-meaning">${w.meaning}</p>
              <p class="word-example"><i data-lucide="quote"></i> "${w.example}"</p>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Live Group Chat Area -->
      <div class="room-chat-panel">
        <div class="chat-messages-container" id="group-chat-messages">
          ${messages.map(msg => {
            const hasImg = msg.senderAvatarImage || (msg.senderId === user.id ? user.avatarImage : '');
            const avatarContent = msg.isAi 
              ? '🤖' 
              : (hasImg ? `<img src="${hasImg}" class="chat-avatar-img" alt="${msg.senderName}">` : msg.senderName.charAt(0).toUpperCase());
            const avatarBg = hasImg ? 'transparent' : (msg.senderAvatar || '#06B6D4');

            return `
            <div class="chat-item ${msg.isAi ? 'chat-item-ai' : (msg.senderId === user.id ? 'chat-item-self' : '')}">
              <div class="chat-avatar ${hasImg ? 'has-custom-img' : ''}" style="background: ${avatarBg}">
                ${avatarContent}
              </div>
              <div class="chat-bubble-box">
                <div class="chat-sender-header">
                  <span class="sender-name">${msg.senderName}</span>
                  <span class="message-time">${msg.time}</span>
                </div>
                <p class="message-text">${msg.text}</p>
                ${msg.appliedWords && msg.appliedWords.length > 0 ? `
                  <div class="applied-words-tags">
                    <i data-lucide="check-circle-2"></i> Đã dùng: ${msg.appliedWords.map(w => `<span class="applied-tag">${w}</span>`).join(" ")}
                  </div>
                ` : ''}
              </div>
            </div>
          `}).join("")}
        </div>

        <!-- Chat Input Form -->
        <form id="form-send-group-message" class="room-chat-form">
          <div class="chat-input-wrapper">
            <input type="text" id="input-group-chat" class="form-control" placeholder="Gõ câu trò chuyện (áp dụng từ vựng hôm nay)..." autocomplete="off" required>
            <button type="submit" class="btn-send-msg" title="Gửi tin nhắn">
              <i data-lucide="send"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  lucide.createIcons();

  // Scroll chat to bottom
  const msgContainer = roomContainer.querySelector("#group-chat-messages");
  if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;

  // Insert word shortcut
  roomContainer.querySelectorAll(".btn-insert-word").forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest(".target-word-card");
      const word = card.dataset.word;
      const input = roomContainer.querySelector("#input-group-chat");
      if (input) {
        input.value += (input.value ? " " : "") + word + " ";
        input.focus();
      }
    };
  });

  // Handle Send Message
  const formChat = roomContainer.querySelector("#form-send-group-message");
  if (formChat) {
    formChat.onsubmit = async (e) => {
      e.preventDefault();
      const input = roomContainer.querySelector("#input-group-chat");
      const text = input.value.trim();
      if (!text) return;

      input.value = "";

      try {
        await storageService.sendGroupMessage(currentGroup.id, text);
        // Refresh room chat messages
        await renderActiveGroupRoom(container);
      } catch (err) {
        alert("Lỗi khi gửi tin nhắn: " + err.message);
      }
    };
  }

  // Launch Video Call Button
  const btnLaunchVideo = roomContainer.querySelector("#btn-launch-video-call");
  if (btnLaunchVideo) {
    btnLaunchVideo.onclick = () => openVideoCallStudio(currentGroup);
  }
}

// --- VIDEO CALL STUDIO LOGIC ---
function initVideoStudioEvents() {
  const modal = document.getElementById("modal-video-studio");
  const btnClose = document.getElementById("btn-close-video-modal");
  const btnEnd = document.getElementById("btn-end-call");
  const btnMic = document.getElementById("btn-toggle-mic");
  const btnCam = document.getElementById("btn-toggle-cam");
  const btnShare = document.getElementById("btn-toggle-share");

  if (!modal) return;

  const closeStudio = () => {
    stopMediaStream();
    modal.classList.add("hidden");
  };

  if (btnClose) btnClose.onclick = closeStudio;
  if (btnEnd) btnEnd.onclick = closeStudio;

  // Mic toggle
  if (btnMic) {
    btnMic.onclick = () => {
      isMicMuted = !isMicMuted;
      if (activeMediaStream) {
        activeMediaStream.getAudioTracks().forEach(track => {
          track.enabled = !isMicMuted;
        });
      }
      btnMic.className = `studio-btn ${isMicMuted ? 'studio-btn-off' : ''}`;
      btnMic.innerHTML = `<i data-lucide="${isMicMuted ? 'mic-off' : 'mic'}"></i> <span>${isMicMuted ? 'Muted' : 'Mic'}</span>`;
      lucide.createIcons();
    };
  }

  // Cam toggle
  if (btnCam) {
    btnCam.onclick = () => {
      isCamOff = !isCamOff;
      const videoEl = document.getElementById("local-video-element");
      const placeholderEl = document.getElementById("local-video-placeholder");

      if (activeMediaStream) {
        activeMediaStream.getVideoTracks().forEach(track => {
          track.enabled = !isCamOff;
        });
      }

      if (videoEl && placeholderEl) {
        videoEl.style.display = isCamOff ? "none" : "block";
        placeholderEl.style.display = isCamOff ? "flex" : "none";
      }

      btnCam.className = `studio-btn ${isCamOff ? 'studio-btn-off' : ''}`;
      btnCam.innerHTML = `<i data-lucide="${isCamOff ? 'video-off' : 'video'}"></i> <span>${isCamOff ? 'Cam Off' : 'Camera'}</span>`;
      lucide.createIcons();
    };
  }

  // Screen share toggle
  if (btnShare) {
    btnShare.onclick = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert("Trình duyệt này không hỗ trợ chia sẻ màn hình.");
        return;
      }

      if (!isScreenSharing) {
        try {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          const videoEl = document.getElementById("local-video-element");
          if (videoEl) videoEl.srcObject = screenStream;
          isScreenSharing = true;
          btnShare.classList.add("studio-btn-active");

          screenStream.getVideoTracks()[0].onended = () => {
            isScreenSharing = false;
            btnShare.classList.remove("studio-btn-active");
            if (activeMediaStream && videoEl) videoEl.srcObject = activeMediaStream;
          };
        } catch (err) {
          console.warn("Screen share cancelled:", err.message);
        }
      } else {
        isScreenSharing = false;
        btnShare.classList.remove("studio-btn-active");
        const videoEl = document.getElementById("local-video-element");
        if (activeMediaStream && videoEl) videoEl.srcObject = activeMediaStream;
      }
    };
  }
}

async function openVideoCallStudio(group) {
  const modal = document.getElementById("modal-video-studio");
  const titleEl = document.getElementById("video-room-title");
  const pillsEl = document.getElementById("video-words-pills");
  const videoEl = document.getElementById("local-video-element");
  const placeholderEl = document.getElementById("local-video-placeholder");

  if (!modal) return;

  if (titleEl) titleEl.textContent = `Phòng Gọi Video: ${group.name}`;

  if (pillsEl) {
    pillsEl.innerHTML = (group.targetWords || []).map(w => `
      <span class="video-word-badge" title="${w.meaning}">
        <strong>${w.word}</strong>: ${w.meaning}
      </span>
    `).join("");
  }

  modal.classList.remove("hidden");
  lucide.createIcons();

  // Request Camera & Mic
  isMicMuted = false;
  isCamOff = false;
  isScreenSharing = false;

  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      activeMediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoEl) {
        videoEl.srcObject = activeMediaStream;
        videoEl.style.display = "block";
      }
      if (placeholderEl) placeholderEl.style.display = "none";
    }
  } catch (err) {
    console.warn("[Video Studio] Camera access denied or not available, fallback to mock view:", err.message);
    if (videoEl) videoEl.style.display = "none";
    if (placeholderEl) placeholderEl.style.display = "flex";
  }
}

function stopMediaStream() {
  if (activeMediaStream) {
    activeMediaStream.getTracks().forEach(track => track.stop());
    activeMediaStream = null;
  }
  const videoEl = document.getElementById("local-video-element");
  if (videoEl) videoEl.srcObject = null;
}
