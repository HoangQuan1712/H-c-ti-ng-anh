// Dashboard Section Controller
import { storageService } from "./storage.js";
import { getStreakTierInfo } from "../app.js";

const GOAL_ICONS = {
  communication: "☕ Giao Tiếp Hàng Ngày",
  business: "💼 Đi Làm & Công Nghệ",
  ielts: "🎯 Luyện Thi IELTS/TOEIC",
  study_abroad: "🎓 Du Học & Định Cư",
  travel: "✈️ Du Lịch & Văn Hóa"
};

export function renderDashboardSection(container, switchTabCallback) {
  const progress = storageService.getDailyProgress();
  const streak = storageService.getStreak();
  const essays = storageService.getEssays();
  const vocab = storageService.getVocab();
  const user = storageService.getCurrentUser();
  const skillLevels = storageService.getUserSkillLevels();
  const learningGoals = storageService.getUserLearningGoals();
  const goalsLabel = learningGoals.map(g => GOAL_ICONS[g] || g).join(" | ");

  const skills = progress.skills;
  const completedCount = Object.values(skills).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  const streakTier = getStreakTierInfo(streak.count);

  container.innerHTML = `
    <!-- Welcome Hero Banner -->
    <div class="hero-banner glass-card fade-in mb-xl">
      <div class="hero-content">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div class="streak-badge-hero ${streakTier.tierClass}">
            <i data-lucide="flame" class="icon-flame-dynamic" style="font-size: ${streakTier.flameSize}; color: ${streakTier.color};"></i> 
            <span><strong>${streak.count}</strong> Ngày Chuỗi Học (${streakTier.text})</span>
          </div>

          <!-- User Personalized Goals Chip -->
          <div class="level-chip goal-chip" style="cursor: pointer;" id="dash-goal-chip" title="Nhấp để thay đổi mục tiêu & trình độ">
            <i data-lucide="target"></i> <strong>${goalsLabel}</strong>
            <span class="text-muted">(W: ${skillLevels.writing} | L: ${skillLevels.listening} | R: ${skillLevels.reading} | S: ${skillLevels.speaking})</span>
          </div>
        </div>

        <h2 class="hero-title">${user ? `Chào mừng ${user.name} đến với ` : ''}Phương Pháp Active Learning: "Học Ngôn Ngữ Bằng Cách Dùng Mỗi Ngày"</h2>
        <p class="hero-desc">Đừng chỉ học lý thuyết thụ động. Mỗi ngày thực hiện đủ 4 kỹ năng chủ động bên dưới để xây dựng phản xạ tiếng Anh tự nhiên nhất.</p>
        
        <div class="progress-bar-container">
          <div class="progress-header">
            <span>Tiến Độ 4 Kỹ Năng Hôm Nay (${completedCount}/4)</span>
            <strong>${progressPercent}%</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill glow-cyan" style="width: ${progressPercent}%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Community & Study Groups Banner -->
    <div class="card glass-card fade-in mb-xl" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.14), rgba(6, 182, 212, 0.12)); border: 1px solid var(--accent-violet-glow);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.4rem; color: var(--accent-violet-light); font-size: 0.85rem; font-weight: 700; margin-bottom: 0.25rem;">
            <i data-lucide="users"></i> PHÒNG HỌC & GỌI VIDEO TRỰC TUYẾN
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #FFF;">Giao Lưu Tiếng Anh & Thử Thách Từ Vựng Mỗi Ngày</h3>
          <p class="text-muted small mt-xs">Tham gia vào các nhóm học theo mục tiêu, ứng dụng ngay 5 từ vựng hôm nay vào chat hoặc bật phòng gọi video đối thoại cùng bạn học.</p>
        </div>
        <button class="btn btn-primary glow-purple btn-nav-skill" data-tab="groups">
          <i data-lucide="video"></i> Vào Nhóm Học Ngay
        </button>
      </div>
    </div>

    <!-- 4 Skills Checklist Grid -->
    <h3 class="section-title mb-md"><i data-lucide="check-circle"></i> Nhiệm Vụ 4 Kỹ Năng Hàng Ngày</h3>
    <div class="grid grid-2 gap-lg mb-xl">
      
      <!-- Card 1: Writing -->
      <div class="skill-checklist-card glass-card ${skills.writing ? 'skill-done' : ''}">
        <div class="skill-card-header">
          <div class="skill-icon icon-cyan"><i data-lucide="pen-tool"></i></div>
          <div class="skill-info">
            <h4>Phần 1: Writing (Luyện Viết)</h4>
            <p>Random chủ đề daily & được AI sửa lỗi bài viết.</p>
          </div>
          <span class="status-tag ${skills.writing ? 'status-done' : 'status-pending'}">
            ${skills.writing ? '✓ Đã Hoàn Thành' : 'Chưa Thực Hiện'}
          </span>
        </div>
        <button class="btn btn-outline glow-cyan full-width mt-md btn-nav-skill" data-tab="writing">
          <i data-lucide="arrow-right"></i> ${skills.writing ? 'Viết Bài Khác' : 'Bắt Đầu Viết Ngay'}
        </button>
      </div>

      <!-- Card 2: Listening -->
      <div class="skill-checklist-card glass-card ${skills.listening ? 'skill-done' : ''}">
        <div class="skill-card-header">
          <div class="skill-icon icon-emerald"><i data-lucide="headphones"></i></div>
          <div class="skill-info">
            <h4>Phần 2: Listening (Luyện Nghe)</h4>
            <p>Nghe bài nghe phù hợp cấp độ & trả lời câu hỏi mở.</p>
          </div>
          <span class="status-tag ${skills.listening ? 'status-done' : 'status-pending'}">
            ${skills.listening ? '✓ Đã Hoàn Thành' : 'Chưa Thực Hiện'}
          </span>
        </div>
        <button class="btn btn-outline glow-emerald full-width mt-md btn-nav-skill" data-tab="listening">
          <i data-lucide="arrow-right"></i> ${skills.listening ? 'Nghe Bài Tiếp Theo' : 'Bắt Đầu Nghe Ngay'}
        </button>
      </div>

      <!-- Card 3: Reading -->
      <div class="skill-checklist-card glass-card ${skills.reading ? 'skill-done' : ''}">
        <div class="skill-card-header">
          <div class="skill-icon icon-violet"><i data-lucide="book-open"></i></div>
          <div class="skill-info">
            <h4>Phần 3: Reading (Luyện Đọc)</h4>
            <p>Lấy bài đọc daily, tra từ & bàn luận Tiếng Anh với Bot.</p>
          </div>
          <span class="status-tag ${skills.reading ? 'status-done' : 'status-pending'}">
            ${skills.reading ? '✓ Đã Hoàn Thành' : 'Chưa Thực Hiện'}
          </span>
        </div>
        <button class="btn btn-outline glow-violet full-width mt-md btn-nav-skill" data-tab="reading">
          <i data-lucide="arrow-right"></i> ${skills.reading ? 'Đọc Bài Khác' : 'Bắt Đầu Đọc & Chat'}
        </button>
      </div>

      <!-- Card 4: Speaking -->
      <div class="skill-checklist-card glass-card ${skills.speaking ? 'skill-done' : ''}">
        <div class="skill-card-header">
          <div class="skill-icon icon-rose"><i data-lucide="mic"></i></div>
          <div class="skill-info">
            <h4>Phần 4: Speaking (Luyện Nói)</h4>
            <p>5 mẫu câu daily, ứng dụng thực tế & ghi âm AI.</p>
          </div>
          <span class="status-tag ${skills.speaking ? 'status-done' : 'status-pending'}">
            ${skills.speaking ? '✓ Đã Hoàn Thành' : 'Chưa Thực Hiện'}
          </span>
        </div>
        <button class="btn btn-outline glow-rose full-width mt-md btn-nav-skill" data-tab="speaking">
          <i data-lucide="arrow-right"></i> ${skills.speaking ? 'Luyện Mẫu Câu Mới' : 'Bắt Đầu Luyện Nói'}
        </button>
      </div>

    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-3 gap-md fade-in">
      <div class="stat-card glass-card">
        <div class="stat-icon"><i data-lucide="file-text"></i></div>
        <div class="stat-number">${essays.length}</div>
        <div class="stat-label">Bài Viết Đã Chấm</div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon"><i data-lucide="bookmark"></i></div>
        <div class="stat-number">${vocab.length}</div>
        <div class="stat-label">Từ Vựng Đã Lưu</div>
      </div>
      <div class="stat-card glass-card">
        <div class="stat-icon"><i data-lucide="flame" style="color: ${streakTier.color}"></i></div>
        <div class="stat-number">${streak.count} ngày</div>
        <div class="stat-label">Chuỗi Ngày Học (${streakTier.text})</div>
      </div>
    </div>
  `;

  lucide.createIcons();

  // Attach navigation shortcut buttons
  document.querySelectorAll(".btn-nav-skill").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabTarget = btn.dataset.tab;
      if (switchTabCallback) switchTabCallback(tabTarget);
    });
  });

  const goalChip = document.getElementById("dash-goal-chip");
  if (goalChip) {
    goalChip.onclick = () => {
      if (switchTabCallback) switchTabCallback("profile");
    };
  }
}
