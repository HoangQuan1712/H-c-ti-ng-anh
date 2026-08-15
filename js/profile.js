// User Profile & Account Settings Controller
import { storageService } from "./storage.js";
import { showOnboardingModal } from "./onboarding.js";
import { initAppHeader, switchTab } from "../app.js";
import { wallpaperService, PRESET_WALLPAPERS } from "./wallpaper.js";

const AVATAR_COLORS = ["#06B6D4", "#8B5CF6", "#10B981", "#F43F5E", "#F59E0B", "#3B82F6", "#EC4899"];
const AVATAR_PRESETS = ["avatar_1", "avatar_2", "avatar_3", "avatar_4", "avatar_5", "avatar_6"];

const CEFR_LEVELS = [
  { code: "A1", label: "A1", desc: "Mới bắt đầu" },
  { code: "A2", label: "A2", desc: "Sơ cấp" },
  { code: "B1", label: "B1", desc: "Trung cấp" },
  { code: "B2", label: "B2", desc: "Tự tin" },
  { code: "C1", label: "C1", desc: "Thành thạo" }
];

const GOAL_LABELS = {
  communication: "Giao Tiếp Tự Nhiên & Hàng Ngày",
  business: "Đi Làm, Kinh Doanh & Công Nghệ",
  ielts: "Luyện Thi Chứng Chỉ (IELTS / TOEIC)",
  study_abroad: "Du Học & Định Cư Nước Ngoài",
  travel: "Du Lịch & Khám Phá Văn Hóa"
};

export function renderProfileSection(container) {
  const user = storageService.getCurrentUser();

  if (!user) {
    container.innerHTML = `
      <div class="empty-state glass-card text-center p-xl fade-in">
        <div class="stat-icon" style="font-size: 3rem; color: var(--accent-cyan);"><i data-lucide="user-x"></i></div>
        <h3 class="mt-md">Bạn Chưa Đăng Nhập Tài Khoản</h3>
        <p class="text-muted mt-xs">Vui lòng đăng nhập hoặc đăng ký tài khoản để thiết lập thông tin cá nhân và lưu trữ kết quả học tập.</p>
        <button id="btn-profile-login" class="btn btn-primary glow-cyan mt-lg">
          <i data-lucide="log-in"></i> Đăng Nhập / Đăng Ký Ngay
        </button>
      </div>
    `;
    lucide.createIcons();
    const btn = document.getElementById("btn-profile-login");
    if (btn) btn.onclick = () => {
      const authBtn = document.getElementById("btn-open-auth-modal");
      if (authBtn) authBtn.click();
    };
    return;
  }

  const initial = (user.name || "U").charAt(0).toUpperCase();
  const skillLevels = user.skillLevels || { writing: "A2", listening: "B1", reading: "B1", speaking: "A2" };
  const learningGoals = storageService.getUserLearningGoals();
  const learningGoal = storageService.getUserLearningGoal();

  container.innerHTML = `
    <div class="profile-page-wrapper fade-in">
      <!-- Profile Header Hero Card -->
      <div class="profile-hero-card glass-card mb-xl">
        <div class="profile-hero-inner">
          <!-- Avatar with Custom Image Upload & Color Palette -->
          <div class="profile-avatar-wrapper">
            <div class="profile-avatar-large ${user.avatarImage ? 'has-custom-img' : ''}" id="preview-avatar" style="${user.avatarImage ? 'background: rgba(255,255,255,0.06);' : `background: ${user.avatarColor || '#06B6D4'}`}">
              ${user.avatarImage ? `<img src="${user.avatarImage}" class="profile-avatar-img-element" id="avatar-img-view" alt="${user.name}">` : `<span id="avatar-initial-view">${initial}</span>`}
              <button type="button" class="avatar-camera-overlay" id="btn-trigger-avatar-file" title="Tải ảnh avatar từ máy tính">
                <i data-lucide="camera"></i>
              </button>
            </div>

            <!-- Hidden File Input for Avatar -->
            <input type="file" id="input-avatar-file" accept="image/*" class="hidden-file-input">

            <!-- Avatar Action Controls -->
            <div class="avatar-btn-actions mt-xs">
              <button type="button" class="btn btn-xs btn-outline glow-cyan" id="btn-browse-avatar" title="Chọn ảnh từ thiết bị">
                <i data-lucide="upload"></i> Đổi Ảnh
              </button>
              ${user.avatarImage ? `
                <button type="button" class="btn btn-xs btn-outline glow-rose" id="btn-remove-avatar-img" title="Xóa ảnh và dùng màu đại diện">
                  <i data-lucide="trash-2"></i> Dùng Màu
                </button>
              ` : ''}
            </div>

            <!-- Color Dots Selector -->
            <div class="avatar-color-picker mt-xs" title="Chọn màu đại diện khi không dùng ảnh">
              ${AVATAR_COLORS.map(c => `
                <button type="button" class="color-dot ${(!user.avatarImage && (user.avatarColor || '#06B6D4') === c) ? 'active-color' : ''}" 
                        data-color="${c}" style="background: ${c};" title="Màu ${c}"></button>
              `).join("")}
            </div>
          </div>

          <!-- User Info Details -->
          <div class="profile-info-main">
            <div class="profile-badges-row">
              <span class="badge badge-primary glow-cyan"><i data-lucide="shield-check"></i> Tài Khoản Học Viên</span>
              <span class="badge badge-outline"><i data-lucide="calendar"></i> Gia nhập: ${user.createdAt || 'Gần đây'}</span>
            </div>
            <h2 class="profile-user-name">${user.name}</h2>
            <p class="profile-user-email text-muted">
              <span><i data-lucide="mail"></i> ${user.email}</span>
              <span><i data-lucide="at-sign"></i> ${user.username || user.email.split('@')[0]}</span>
              <span><i data-lucide="graduation-cap"></i> ${user.education || 'Người đi làm'}</span>
            </p>

            <!-- Skill Levels Pills Row -->
            <div class="profile-levels-chips">
              <div class="level-chip"><span class="chip-skill">Writing:</span> <strong class="chip-val">${skillLevels.writing}</strong></div>
              <div class="level-chip"><span class="chip-skill">Listening:</span> <strong class="chip-val">${skillLevels.listening}</strong></div>
              <div class="level-chip"><span class="chip-skill">Reading:</span> <strong class="chip-val">${skillLevels.reading}</strong></div>
              <div class="level-chip"><span class="chip-skill">Speaking:</span> <strong class="chip-val">${skillLevels.speaking}</strong></div>
              ${learningGoals.map(g => `
                <div class="level-chip goal-chip" title="Mục đích học tập"><i data-lucide="target"></i> <strong>${GOAL_LABELS[g] || g}</strong></div>
              `).join("")}
            </div>
          </div>

          <!-- Action Button -->
          <div class="profile-hero-actions">
            <button id="btn-re-assessment" class="btn btn-outline glow-cyan">
              <i data-lucide="sliders"></i> Khảo Sát Lại Trình Độ
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Tabs Section -->
      <div class="profile-tabs-nav mb-lg">
        <button class="profile-nav-btn active" data-tab="tab-personal">
          <i data-lucide="user"></i> Thông Tin Cá Nhân
        </button>
        <button class="profile-nav-btn" data-tab="tab-levels">
          <i data-lucide="bar-chart-2"></i> Trình Độ & Mục Tiêu
        </button>
        <button class="profile-nav-btn" data-tab="tab-security">
          <i data-lucide="lock"></i> Bảo Mật & Mật Khẩu
        </button>
        <button class="profile-nav-btn" data-tab="tab-appearance">
          <i data-lucide="image"></i> Hình Nền & Giao Diện
        </button>
      </div>

      <!-- Tab 1: Personal Info -->
      <div id="tab-personal" class="profile-tab-content glass-card p-xl fade-in">
        <h3 class="section-title mb-md"><i data-lucide="edit-3"></i> Cập Nhật Thông Tin Cá Nhân</h3>
        <p class="text-muted small mb-lg">Thông tin được lưu trữ đồng bộ vào cơ sở dữ liệu trên máy tính của bạn.</p>

        <div id="alert-profile-info" class="auth-alert hidden mb-md"></div>

        <form id="form-update-profile" class="grid grid-2 gap-lg">
          <div class="form-group">
            <label><i data-lucide="user"></i> Họ và Tên (*)</label>
            <input type="text" id="input-prof-name" class="form-control" value="${user.name || ''}" required>
          </div>
          <div class="form-group">
            <label><i data-lucide="at-sign"></i> Tên Người Dùng (Username)</label>
            <input type="text" id="input-prof-username" class="form-control" value="${user.username || user.email.split('@')[0]}" required>
          </div>
          <div class="form-group">
            <label><i data-lucide="mail"></i> Địa Chỉ Email (*)</label>
            <input type="email" id="input-prof-email" class="form-control" value="${user.email || ''}" required>
          </div>
          <div class="form-group">
            <label><i data-lucide="calendar"></i> Ngày Sinh</label>
            <input type="date" id="input-prof-birthday" class="form-control" value="${user.birthday || ''}">
          </div>
          <div class="form-group">
            <label><i data-lucide="map-pin"></i> Địa Chỉ / Nơi Ở</label>
            <input type="text" id="input-prof-address" class="form-control" placeholder="Ví dụ: Hà Nội, Việt Nam" value="${user.address || ''}">
          </div>
          <div class="form-group">
            <label><i data-lucide="graduation-cap"></i> Trình Độ Học Vấn / Nghề Nghiệp</label>
            <select id="select-prof-education" class="form-control">
              <option value="Học sinh cấp 2/3" ${user.education === 'Học sinh cấp 2/3' ? 'selected' : ''}>Học sinh Cấp 2 / Cấp 3</option>
              <option value="Sinh viên Đại học" ${user.education === 'Sinh viên Đại học' ? 'selected' : ''}>Sinh viên Đại học / Cao đẳng</option>
              <option value="Người đi làm" ${(!user.education || user.education === 'Người đi làm') ? 'selected' : ''}>Người đi làm / Nhân viên công sở</option>
              <option value="Lập trình viên / Công nghệ" ${user.education === 'Lập trình viên / Công nghệ' ? 'selected' : ''}>Lập trình viên / Chuyên viên CNTT</option>
              <option value="Doanh nhân / Quản lý" ${user.education === 'Doanh nhân / Quản lý' ? 'selected' : ''}>Doanh nhân / Nhà quản lý</option>
              <option value="Thạc sĩ / Tiến sĩ / Giảng viên" ${user.education === 'Thạc sĩ / Tiến sĩ / Giảng viên' ? 'selected' : ''}>Thạc sĩ / Tiến sĩ / Giảng viên</option>
            </select>
          </div>

          <div style="grid-column: 1 / -1;" class="mt-md">
            <button type="submit" id="btn-save-profile" class="btn btn-primary glow-cyan">
              <i data-lucide="save"></i> Lưu Thay Đổi Hồ Sơ
            </button>
          </div>
        </form>
      </div>

      <!-- Tab 2: Skill Levels & Goals -->
      <div id="tab-levels" class="profile-tab-content glass-card p-xl hidden fade-in">
        <h3 class="section-title mb-md"><i data-lucide="sliders"></i> Thiết Lập Cấp Độ 4 Kỹ Năng & Mục Tiêu</h3>
        <p class="text-muted small mb-lg">Lựa chọn cấp độ hiện tại để nhận các đề bài và độ khó phù hợp nhất.</p>

        <!-- Diagnostic Test Promotion Callout Card -->
        <div class="test-callout-card glow-purple-card mb-xl">
          <div class="test-callout-left">
            <div class="callout-icon-box"><i data-lucide="award"></i></div>
            <div>
              <span class="badge badge-purple mb-xs">Khuyên dùng • Tự động xếp lớp</span>
              <h4 class="callout-title">Làm Bài Test Đánh Giá Trình Độ Thực Tế (3-5 Phút)</h4>
              <p class="text-muted small">Kiểm tra thực tế 4 kỹ năng Nghe qua audio, Đọc hiểu, Ngữ pháp và Nói qua Micro để AI tự động chấm điểm và xếp cấp độ CEFR chuẩn xác cho bạn.</p>
            </div>
          </div>
          <button type="button" id="btn-profile-start-test" class="btn btn-primary glow-purple">
            <i data-lucide="play-circle"></i> Bắt Đầu Làm Bài Test
          </button>
        </div>

        <div id="alert-profile-levels" class="auth-alert hidden mb-md"></div>

        <form id="form-update-levels">
          <!-- Multi-Goal Selector -->
          <div class="form-group mb-xl">
            <label style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
              <span><i data-lucide="target"></i> Mục Đích Học Tập (Có thể chọn nhiều mục tiêu)</span>
              <span class="badge badge-purple" style="font-size: 0.8rem; padding: 0.25rem 0.65rem; display: flex; align-items: center; gap: 0.35rem;">
                <i data-lucide="check-check"></i> Đã chọn: <strong id="prof-goals-count">${learningGoals.length}</strong> mục tiêu
              </span>
            </label>
            <div class="goals-grid-spacious mt-xs" id="prof-goals-container">
              ${[
                { id: "communication", icon: "message-circle", title: "Giao Tiếp Hàng Ngày", badge: "Phổ biến" },
                { id: "business", icon: "briefcase", title: "Đi Làm & Công Nghệ", badge: "Sự nghiệp" },
                { id: "ielts", icon: "award", title: "Luyện Thi IELTS / TOEIC", badge: "Học thuật" },
                { id: "study_abroad", icon: "graduation-cap", title: "Du Học & Định Cư", badge: "Quốc tế" },
                { id: "travel", icon: "plane", title: "Du Lịch & Văn Hóa", badge: "Trải nghiệm" }
              ].map(g => `
                <div class="goal-card-spacious ${learningGoals.includes(g.id) ? 'active-goal' : ''}" data-goal="${g.id}" style="padding: 1.15rem; cursor: pointer;">
                  <div class="goal-card-top-row" style="margin-bottom: 0.5rem;">
                    <div class="goal-icon-large" style="width: 38px; height: 38px;"><i data-lucide="${g.icon}"></i></div>
                    <span class="goal-type-badge">${g.badge}</span>
                  </div>
                  <h4 class="goal-heading" style="font-size: 0.95rem; margin-bottom: 0;">${g.title}</h4>
                  <div class="goal-selected-indicator"><i data-lucide="check"></i></div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Levels Matrix -->
          <div class="skills-level-table glass-card mb-xl">
            <!-- Writing -->
            <div class="skill-level-row">
              <div class="skill-label-cell">
                <i data-lucide="pen-tool" class="icon-cyan"></i> <strong>Writing (Viết)</strong>
              </div>
              <div class="level-selector-pills" id="prof-level-writing">
                ${CEFR_LEVELS.map(lvl => `
                  <button type="button" class="level-pill ${skillLevels.writing === lvl.code ? 'active' : ''}" data-level="${lvl.code}">
                    ${lvl.code}
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- Listening -->
            <div class="skill-level-row">
              <div class="skill-label-cell">
                <i data-lucide="headphones" class="icon-emerald"></i> <strong>Listening (Nghe)</strong>
              </div>
              <div class="level-selector-pills" id="prof-level-listening">
                ${CEFR_LEVELS.map(lvl => `
                  <button type="button" class="level-pill ${skillLevels.listening === lvl.code ? 'active' : ''}" data-level="${lvl.code}">
                    ${lvl.code}
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- Reading -->
            <div class="skill-level-row">
              <div class="skill-label-cell">
                <i data-lucide="book-open" class="icon-violet"></i> <strong>Reading (Đọc)</strong>
              </div>
              <div class="level-selector-pills" id="prof-level-reading">
                ${CEFR_LEVELS.map(lvl => `
                  <button type="button" class="level-pill ${skillLevels.reading === lvl.code ? 'active' : ''}" data-level="${lvl.code}">
                    ${lvl.code}
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- Speaking -->
            <div class="skill-level-row">
              <div class="skill-label-cell">
                <i data-lucide="mic" class="icon-rose"></i> <strong>Speaking (Nói)</strong>
              </div>
              <div class="level-selector-pills" id="prof-level-speaking">
                ${CEFR_LEVELS.map(lvl => `
                  <button type="button" class="level-pill ${skillLevels.speaking === lvl.code ? 'active' : ''}" data-level="${lvl.code}">
                    ${lvl.code}
                  </button>
                `).join("")}
              </div>
            </div>
          </div>

          <button type="submit" id="btn-save-levels" class="btn btn-primary glow-purple">
            <i data-lucide="check"></i> Lưu Cập Nhật Trình Độ & Mục Tiêu
          </button>
        </form>
      </div>

      <!-- Tab 3: Security & Password Change -->
      <div id="tab-security" class="profile-tab-content glass-card p-xl hidden fade-in">
        <h3 class="section-title mb-md"><i data-lucide="shield"></i> Đổi Mật Khẩu Tài Khoản</h3>
        <p class="text-muted small mb-lg">Hãy sử dụng mật khẩu an toàn có ít nhất 6 ký tự.</p>

        <div id="alert-change-password" class="auth-alert hidden mb-md"></div>

        <form id="form-change-password" style="max-width: 480px;">
          <div class="form-group">
            <label><i data-lucide="lock"></i> Mật Khẩu Hiện Tại (*)</label>
            <div class="input-password-wrapper">
              <input type="password" id="input-old-password" class="form-control" placeholder="••••••••" required>
              <button type="button" class="btn-toggle-password" data-target="input-old-password"><i data-lucide="eye"></i></button>
            </div>
          </div>

          <div class="form-group">
            <label><i data-lucide="key"></i> Mật Khẩu Mới (*)</label>
            <div class="input-password-wrapper">
              <input type="password" id="input-new-password" class="form-control" placeholder="Tối thiểu 6 ký tự" required>
              <button type="button" class="btn-toggle-password" data-target="input-new-password"><i data-lucide="eye"></i></button>
            </div>
          </div>

          <div class="form-group">
            <label><i data-lucide="check-square"></i> Xác Nhận Mật Khẩu Mới (*)</label>
            <div class="input-password-wrapper">
              <input type="password" id="input-confirm-new-password" class="form-control" placeholder="Nhập lại mật khẩu mới" required>
              <button type="button" class="btn-toggle-password" data-target="input-confirm-new-password"><i data-lucide="eye"></i></button>
            </div>
          </div>

          <button type="submit" id="btn-submit-change-password" class="btn btn-primary glow-rose mt-md">
            <i data-lucide="shield-check"></i> Cập Nhật Mật Khẩu Mới
          </button>
        </form>
      </div>

      <!-- Tab 4: Wallpaper & Appearance Settings -->
      <div id="tab-appearance" class="profile-tab-content glass-card p-xl fade-in hidden">
        <div class="section-header-compact mb-lg">
          <div>
            <h3 class="section-title mb-xs"><i data-lucide="image"></i> Tùy Chỉnh Hình Nền Ứng Dụng (Custom Wallpaper)</h3>
            <p class="text-muted small">Tải ảnh từ máy tính hoặc điện thoại của bạn lên làm hình nền riêng biệt, tùy chỉnh độ mờ & độ tối êm mắt.</p>
          </div>
        </div>

        <div class="wallpaper-settings-grid">
          <!-- Left Column: Upload From Device -->
          <div class="wallpaper-upload-card glass-card p-lg">
            <h4 class="sub-title mb-md"><i data-lucide="upload-cloud"></i> 1. Tải Ảnh Từ Thiết Bị Của Bạn</h4>
            
            <div class="upload-dropzone" id="wallpaper-dropzone">
              <input type="file" id="input-wallpaper-file" accept="image/*" class="hidden-file-input">
              <div class="dropzone-inner" id="dropzone-content">
                <i data-lucide="image-plus" class="icon-dropzone"></i>
                <p class="dropzone-title">Nhấp vào đây hoặc Kéo & Thả ảnh vào</p>
                <p class="dropzone-hint text-muted">Hỗ trợ JPG, PNG, WEBP, GIF (Khuyên dùng ảnh phong cảnh / 16:9)</p>
                <button type="button" class="btn btn-sm btn-outline glow-cyan mt-sm" id="btn-browse-wallpaper">
                  <i data-lucide="folder-open"></i> Chọn Ảnh Từ Máy Tính
                </button>
              </div>

              <div class="preview-zone hidden" id="wallpaper-preview-zone">
                <img id="wallpaper-preview-img" src="" alt="Wallpaper preview">
                <div class="preview-overlay-info">
                  <span id="wallpaper-file-name" class="file-name">my_wallpaper.jpg</span>
                  <button type="button" class="btn-remove-preview" id="btn-clear-preview" title="Hủy chọn ảnh"><i data-lucide="x"></i></button>
                </div>
              </div>
            </div>

            <div class="upload-actions mt-md" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" id="btn-apply-uploaded-wallpaper" class="btn btn-primary glow-cyan" disabled>
                <i data-lucide="check"></i> Áp Dụng Ảnh Nền Này
              </button>
              <button type="button" id="btn-reset-wallpaper" class="btn btn-outline glow-rose">
                <i data-lucide="rotate-ccw"></i> Trở Về Nền Mặc Định
              </button>
            </div>
          </div>

          <!-- Right Column: Wallpaper Sliders & Adjustments -->
          <div class="wallpaper-controls-card glass-card p-lg">
            <h4 class="sub-title mb-md"><i data-lucide="sliders"></i> 2. Điều Chỉnh Độ Tối & Độ Mờ Nền</h4>
            <p class="text-muted small mb-lg">Tự động phủ lớp tối mờ điện ảnh giúp chữ viết và bài học luôn tương phản 100% rõ nét trên mọi bức ảnh.</p>

            <div class="slider-group mb-lg">
              <div class="slider-header">
                <span><i data-lucide="sun"></i> Độ Tối Nền (Overlay Dimming):</span>
                <strong id="val-overlay-dimming">${Math.round((wallpaperService.getConfig().overlayOpacity || 0.72) * 100)}%</strong>
              </div>
              <input type="range" id="slider-overlay-dimming" min="30" max="95" value="${Math.round((wallpaperService.getConfig().overlayOpacity || 0.72) * 100)}" class="custom-range-slider">
              <div class="slider-hint">Kéo tăng nếu ảnh quá sáng, giúp giao diện đọc chữ êm mắt hơn.</div>
            </div>

            <div class="slider-group mb-lg">
              <div class="slider-header">
                <span><i data-lucide="sparkles"></i> Độ Mờ Hậu Cảnh (Background Blur):</span>
                <strong id="val-bg-blur">${wallpaperService.getConfig().blurAmount || 0}px</strong>
              </div>
              <input type="range" id="slider-bg-blur" min="0" max="15" value="${wallpaperService.getConfig().blurAmount || 0}" class="custom-range-slider">
              <div class="slider-hint">Tạo hiệu ứng Bokeh xóa phông mờ ảo cho hậu cảnh.</div>
            </div>

            <div class="status-box-wallpaper mt-md">
              <span class="status-label">Trạng thái hiện tại:</span>
              <strong id="current-wallpaper-status" class="status-badge-active">
                ${wallpaperService.getConfig().type === "custom" ? "Ảnh Tùy Chỉnh Của Bạn" : (wallpaperService.getConfig().type === "preset" ? "Bộ Sưu Tập Có Sẵn" : "Nền Mặc Định")}
              </strong>
            </div>
          </div>
        </div>

        <!-- Presets Gallery -->
        <div class="wallpaper-presets-section mt-xl">
          <h4 class="sub-title mb-md"><i data-lucide="sparkles"></i> 3. Hoặc Chọn Bộ Sưu Tập Ảnh Nền Tuyệt Đẹp Sẵn Có</h4>
          <div class="preset-wallpapers-grid" id="preset-wallpapers-container">
            ${PRESET_WALLPAPERS.map(p => `
              <div class="preset-wallpaper-card ${wallpaperService.getConfig().presetId === p.id || (p.id === 'default' && wallpaperService.getConfig().type === 'default') ? 'active-preset' : ''}" data-id="${p.id}">
                <div class="preset-thumb" style="background-image: url('${p.thumb}')">
                  <div class="preset-overlay">
                    <span class="preset-apply-badge"><i data-lucide="check"></i> Đang Chọn</span>
                  </div>
                </div>
                <div class="preset-info">
                  <strong class="preset-name">${p.name}</strong>
                  <p class="preset-desc text-muted small">${p.desc}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();

  // Attach Tab Switcher in Profile
  const navBtns = container.querySelectorAll(".profile-nav-btn");
  const tabContents = container.querySelectorAll(".profile-tab-content");

  navBtns.forEach(btn => {
    btn.onclick = () => {
      navBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.add("hidden"));

      btn.classList.add("active");
      const targetTab = container.querySelector(`#${btn.dataset.tab}`);
      if (targetTab) targetTab.classList.remove("hidden");
    };
  });

  // Re-assessment trigger
  const btnReAssess = document.getElementById("btn-re-assessment");
  if (btnReAssess) {
    btnReAssess.onclick = () => {
      showOnboardingModal(() => {
        renderProfileSection(container);
        initAppHeader();
      });
    };
  }

  // Avatar Photo Upload & Color picker handlers
  const inputAvatarFile = document.getElementById("input-avatar-file");
  const btnTriggerAvatar = document.getElementById("btn-trigger-avatar-file");
  const btnBrowseAvatar = document.getElementById("btn-browse-avatar");
  const btnRemoveAvatarImg = document.getElementById("btn-remove-avatar-img");

  const handleAvatarFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Vui lòng chọn một tệp hình ảnh hợp lệ (JPG, PNG, WEBP, GIF).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = e.target.result;
      const img = new Image();
      img.onload = async () => {
        // Crop & optimize avatar to 256x256 square
        const canvas = document.createElement("canvas");
        const SIZE = 256;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");

        // Center crop
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, SIZE, SIZE);
        const avatarDataUrl = canvas.toDataURL("image/jpeg", 0.88);

        await storageService.updateUserProfile({ avatarImage: avatarDataUrl });
        initAppHeader();
        renderProfileSection(container);
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  if (btnTriggerAvatar && inputAvatarFile) {
    btnTriggerAvatar.onclick = (e) => {
      e.stopPropagation();
      inputAvatarFile.click();
    };
  }

  if (btnBrowseAvatar && inputAvatarFile) {
    btnBrowseAvatar.onclick = () => {
      inputAvatarFile.click();
    };
  }

  if (inputAvatarFile) {
    inputAvatarFile.onchange = () => {
      if (inputAvatarFile.files && inputAvatarFile.files[0]) {
        handleAvatarFile(inputAvatarFile.files[0]);
      }
    };
  }

  if (btnRemoveAvatarImg) {
    btnRemoveAvatarImg.onclick = async () => {
      await storageService.updateUserProfile({ avatarImage: "" });
      initAppHeader();
      renderProfileSection(container);
    };
  }

  // Color picker avatar (clears custom image and applies color)
  let currentSelectedColor = user.avatarColor || "#06B6D4";
  container.querySelectorAll(".color-dot").forEach(dot => {
    dot.onclick = async () => {
      container.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active-color"));
      dot.classList.add("active-color");
      currentSelectedColor = dot.dataset.color;

      await storageService.updateUserProfile({ 
        avatarColor: currentSelectedColor,
        avatarImage: "" 
      });
      initAppHeader();
      renderProfileSection(container);
    };
  });

  // Level selector in Tab 2
  let updatedLevels = { ...skillLevels };
  ["writing", "listening", "reading", "speaking"].forEach(skill => {
    const el = document.getElementById(`prof-level-${skill}`);
    if (el) {
      el.querySelectorAll(".level-pill").forEach(pill => {
        pill.onclick = () => {
          el.querySelectorAll(".level-pill").forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          updatedLevels[skill] = pill.dataset.level;
        };
      });
    }
  });

  // Save Personal Info
  const formProfile = document.getElementById("form-update-profile");
  if (formProfile) {
    formProfile.onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById("btn-save-profile");
      const alertEl = document.getElementById("alert-profile-info");
      alertEl.classList.add("hidden");

      const name = document.getElementById("input-prof-name").value.trim();
      const username = document.getElementById("input-prof-username").value.trim();
      const email = document.getElementById("input-prof-email").value.trim();
      const birthday = document.getElementById("input-prof-birthday").value;
      const address = document.getElementById("input-prof-address").value.trim();
      const education = document.getElementById("select-prof-education").value;

      try {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-sm"></span> Đang lưu...`;

        await storageService.updateUserProfile({
          name, username, email, birthday, address, education
        });

        alertEl.className = "auth-alert auth-alert-success";
        alertEl.innerHTML = "✅ Cập nhật thông tin hồ sơ thành công và đã lưu vào Database!";
        alertEl.classList.remove("hidden");

        initAppHeader();
        setTimeout(() => renderProfileSection(container), 800);
      } catch (err) {
        alertEl.className = "auth-alert auth-alert-error";
        alertEl.innerHTML = "❌ Lỗi: " + err.message;
        alertEl.classList.remove("hidden");
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="save"></i> Lưu Thay Đổi Hồ Sơ`;
        lucide.createIcons();
      }
    };
  }

  // Diagnostic Placement Test Button (Full-Page Standalone View)
  const btnStartTest = document.getElementById("btn-profile-start-test");
  if (btnStartTest) {
    btnStartTest.onclick = () => {
      switchTab("placement-test");
    };
  }

  // Multi-Goal Card Toggles in Profile
  let profSelectedGoals = new Set(learningGoals);
  container.querySelectorAll("#prof-goals-container .goal-card-spacious").forEach(card => {
    card.onclick = () => {
      const gId = card.dataset.goal;
      if (profSelectedGoals.has(gId)) {
        if (profSelectedGoals.size > 1) {
          profSelectedGoals.delete(gId);
          card.classList.remove("active-goal");
        }
      } else {
        profSelectedGoals.add(gId);
        card.classList.add("active-goal");
      }
      const countEl = document.getElementById("prof-goals-count");
      if (countEl) countEl.textContent = profSelectedGoals.size;
    };
  });

  // Save Levels & Goal
  const formLevels = document.getElementById("form-update-levels");
  if (formLevels) {
    formLevels.onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById("btn-save-levels");
      const alertEl = document.getElementById("alert-profile-levels");
      alertEl.classList.add("hidden");

      const goalsArr = Array.from(profSelectedGoals);

      try {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-sm"></span> Đang lưu...`;

        await storageService.updateUserProfile({
          skillLevels: updatedLevels,
          learningGoals: goalsArr,
          learningGoal: goalsArr[0] || "communication"
        });

        alertEl.className = "auth-alert auth-alert-success";
        alertEl.innerHTML = "✅ Cập nhật trình độ và các mục tiêu học tập thành công!";
        alertEl.classList.remove("hidden");

        initAppHeader();
        setTimeout(() => renderProfileSection(container), 800);
      } catch (err) {
        alertEl.className = "auth-alert auth-alert-error";
        alertEl.innerHTML = "❌ Lỗi: " + err.message;
        alertEl.classList.remove("hidden");
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="check"></i> Lưu Cập Nhật Trình Độ & Mục Tiêu`;
        lucide.createIcons();
      }
    };
  }

  // Change Password
  const formPassword = document.getElementById("form-change-password");
  if (formPassword) {
    formPassword.onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById("btn-submit-change-password");
      const alertEl = document.getElementById("alert-change-password");
      alertEl.classList.add("hidden");

      const oldPassword = document.getElementById("input-old-password").value.trim();
      const newPassword = document.getElementById("input-new-password").value.trim();
      const confirmNewPassword = document.getElementById("input-confirm-new-password").value.trim();

      if (newPassword.length < 6) {
        alertEl.className = "auth-alert auth-alert-error";
        alertEl.innerHTML = "❌ Mật khẩu mới phải có tối thiểu 6 ký tự.";
        alertEl.classList.remove("hidden");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        alertEl.className = "auth-alert auth-alert-error";
        alertEl.innerHTML = "❌ Mật khẩu xác nhận không khớp.";
        alertEl.classList.remove("hidden");
        return;
      }

      try {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-sm"></span> Đang xử lý...`;

        await storageService.changePassword(oldPassword, newPassword);

        alertEl.className = "auth-alert auth-alert-success";
        alertEl.innerHTML = "🎉 Đổi mật khẩu thành công!";
        alertEl.classList.remove("hidden");

        formPassword.reset();
      } catch (err) {
        alertEl.className = "auth-alert auth-alert-error";
        alertEl.innerHTML = "❌ Lỗi: " + err.message;
        alertEl.classList.remove("hidden");
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="shield-check"></i> Cập Nhật Mật Khẩu Mới`;
        lucide.createIcons();
      }
    };
  }

  // Password visibility toggles
  container.querySelectorAll(".btn-toggle-password").forEach(btn => {
    btn.onclick = () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      btn.innerHTML = isPass ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
      lucide.createIcons();
    };
  });

  // ==========================================
  // TAB 4: WALLPAPER & APPEARANCE CONTROLLER
  // ==========================================
  let uploadedDataUrl = "";

  const fileInput = document.getElementById("input-wallpaper-file");
  const btnBrowse = document.getElementById("btn-browse-wallpaper");
  const dropzone = document.getElementById("wallpaper-dropzone");
  const dropzoneContent = document.getElementById("dropzone-content");
  const previewZone = document.getElementById("wallpaper-preview-zone");
  const previewImg = document.getElementById("wallpaper-preview-img");
  const fileNameEl = document.getElementById("wallpaper-file-name");
  const btnClearPreview = document.getElementById("btn-clear-preview");
  const btnApplyUploaded = document.getElementById("btn-apply-uploaded-wallpaper");
  const btnResetWallpaper = document.getElementById("btn-reset-wallpaper");
  const sliderOverlay = document.getElementById("slider-overlay-dimming");
  const sliderBlur = document.getElementById("slider-bg-blur");
  const valOverlay = document.getElementById("val-overlay-dimming");
  const valBlur = document.getElementById("val-bg-blur");
  const statusEl = document.getElementById("current-wallpaper-status");

  // Browse file trigger
  if (btnBrowse && fileInput) {
    btnBrowse.onclick = (e) => {
      e.stopPropagation();
      fileInput.click();
    };
  }
  if (dropzone && fileInput) {
    dropzone.onclick = () => {
      if (previewZone.classList.contains("hidden")) {
        fileInput.click();
      }
    };
  }

  // Handle selected image file
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Vui lòng chọn một tệp hình ảnh hợp lệ (JPG, PNG, WEBP, GIF).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = e.target.result;
      
      // Optimize image via Canvas to prevent heavy memory usage
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        uploadedDataUrl = canvas.toDataURL("image/jpeg", 0.85);

        // Show preview in UI
        previewImg.src = uploadedDataUrl;
        fileNameEl.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
        dropzoneContent.classList.add("hidden");
        previewZone.classList.remove("hidden");
        btnApplyUploaded.disabled = false;
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  if (fileInput) {
    fileInput.onchange = () => {
      if (fileInput.files && fileInput.files[0]) {
        processImageFile(fileInput.files[0]);
      }
    };
  }

  // Drag & drop support
  if (dropzone) {
    dropzone.ondragover = (e) => {
      e.preventDefault();
      dropzone.classList.add("dropzone-active");
    };
    dropzone.ondragleave = () => {
      dropzone.classList.remove("dropzone-active");
    };
    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.classList.remove("dropzone-active");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processImageFile(e.dataTransfer.files[0]);
      }
    };
  }

  // Clear preview
  if (btnClearPreview) {
    btnClearPreview.onclick = (e) => {
      e.stopPropagation();
      uploadedDataUrl = "";
      fileInput.value = "";
      previewImg.src = "";
      dropzoneContent.classList.remove("hidden");
      previewZone.classList.add("hidden");
      btnApplyUploaded.disabled = true;
    };
  }

  // Apply uploaded image
  if (btnApplyUploaded) {
    btnApplyUploaded.onclick = () => {
      if (!uploadedDataUrl) return;
      const overlayVal = Number(sliderOverlay.value) / 100;
      const blurVal = Number(sliderBlur.value);
      wallpaperService.setCustomImage(uploadedDataUrl, overlayVal, blurVal);

      statusEl.textContent = "Ảnh Tùy Chỉnh Của Bạn";
      container.querySelectorAll(".preset-wallpaper-card").forEach(c => c.classList.remove("active-preset"));

      alert("🎉 Đã áp dụng ảnh nền từ thiết bị của bạn thành công!");
    };
  }

  // Reset to default
  if (btnResetWallpaper) {
    btnResetWallpaper.onclick = () => {
      wallpaperService.resetToDefault();
      uploadedDataUrl = "";
      if (fileInput) fileInput.value = "";
      dropzoneContent.classList.remove("hidden");
      previewZone.classList.add("hidden");
      btnApplyUploaded.disabled = true;

      sliderOverlay.value = 72;
      valOverlay.textContent = "72%";
      sliderBlur.value = 0;
      valBlur.textContent = "0px";
      statusEl.textContent = "Nền Mặc Định";

      container.querySelectorAll(".preset-wallpaper-card").forEach(c => {
        c.classList.toggle("active-preset", c.dataset.id === "default");
      });

      alert("ℹ️ Đã chuyển về hình nền Fluent Dark mặc định.");
    };
  }

  // Real-time Sliders
  if (sliderOverlay) {
    sliderOverlay.oninput = () => {
      valOverlay.textContent = `${sliderOverlay.value}%`;
      const overlayVal = Number(sliderOverlay.value) / 100;
      const blurVal = Number(sliderBlur.value);
      wallpaperService.updateAdjustments(overlayVal, blurVal);
    };
  }

  if (sliderBlur) {
    sliderBlur.oninput = () => {
      valBlur.textContent = `${sliderBlur.value}px`;
      const overlayVal = Number(sliderOverlay.value) / 100;
      const blurVal = Number(sliderBlur.value);
      wallpaperService.updateAdjustments(overlayVal, blurVal);
    };
  }

  // Preset wallpaper cards
  container.querySelectorAll(".preset-wallpaper-card").forEach(card => {
    card.onclick = () => {
      const presetId = card.dataset.id;
      const overlayVal = Number(sliderOverlay.value) / 100;
      const blurVal = Number(sliderBlur.value);

      wallpaperService.setPreset(presetId, overlayVal, blurVal);

      container.querySelectorAll(".preset-wallpaper-card").forEach(c => c.classList.remove("active-preset"));
      card.classList.add("active-preset");

      if (presetId === "default") {
        statusEl.textContent = "Nền Mặc Định";
      } else {
        const found = PRESET_WALLPAPERS.find(p => p.id === presetId);
        statusEl.textContent = found ? `Bộ Sưu Tập: ${found.name}` : "Bộ Sưu Tập Có Sẵn";
      }
    };
  });
}
