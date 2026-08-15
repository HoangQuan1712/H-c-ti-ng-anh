// Listening Section Controller
import { LISTENING_DATA } from "./data/listening.js";
import { storageService } from "./storage.js";

let selectedLevel = "all";
let currentLessonIndex = 0;
let isPlaying = false;
let currentUtterance = null;

export function renderListeningSection(container) {
  const filteredLessons = selectedLevel === "all"
    ? LISTENING_DATA
    : LISTENING_DATA.filter(l => l.level === selectedLevel);

  const activeLesson = filteredLessons[currentLessonIndex] || filteredLessons[0];

  container.innerHTML = `
    <div class="section-header fade-in">
      <div>
        <h2 class="section-title"><i data-lucide="headphones"></i> Phần 2: Listening (Luyện Nghe Phân Cấp)</h2>
        <p class="section-subtitle">Bài nghe chọn lọc theo cấp độ tránh quá khó. Nghe xong trả lời trắc nghiệm và nêu cảm nhận.</p>
      </div>

      <!-- Level Filter Pills -->
      <div class="level-pills">
        <button class="pill ${selectedLevel === 'all' ? 'active' : ''}" data-level="all">Tất Cả</button>
        <button class="pill ${selectedLevel === 'beginner' ? 'active' : ''}" data-level="beginner">🌱 Sơ Cấp (A1-A2)</button>
        <button class="pill ${selectedLevel === 'intermediate' ? 'active' : ''}" data-level="intermediate">🚀 Trung Cấp (B1-B2)</button>
        <button class="pill ${selectedLevel === 'advanced' ? 'active' : ''}" data-level="advanced">🔥 Nâng Cao (C1-C2)</button>
      </div>
    </div>

    ${!activeLesson ? '<div class="empty-state">Không có bài nghe ở cấp độ này.</div>' : `
      <div class="grid grid-2 gap-lg">
        <!-- Left: Audio Player & Transcript -->
        <div class="card glass-card fade-in">
          <div class="lesson-meta">
            <span class="badge badge-cyan">${activeLesson.levelLabel}</span>
            <span class="text-muted"><i data-lucide="clock"></i> ${activeLesson.duration}</span>
          </div>

          <h3 class="lesson-title">${activeLesson.title}</h3>
          <p class="topic-tag"><i data-lucide="tag"></i> Chủ đề: ${activeLesson.topic}</p>

          <!-- Audio Player Box -->
          <div class="audio-player-box">
            <div class="audio-controls">
              <button id="btn-play-audio" class="btn-play-large pulse-cyan">
                <i data-lucide="play" id="audio-play-icon"></i>
              </button>

              <div class="audio-info">
                <span id="audio-status-text" class="audio-status">Sẵn sàng phát bài nghe</span>
                <div class="audio-progress-bar">
                  <div id="audio-progress-fill" class="progress-fill" style="width: 0%"></div>
                </div>
              </div>

              <!-- Speed Selector -->
              <select id="audio-speed-select" class="speed-select">
                <option value="0.75">0.75x</option>
                <option value="1" selected>1.0x (Thường)</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>
          </div>

          <!-- Transcript Section -->
          <div class="transcript-section">
            <div class="transcript-header">
              <h4><i data-lucide="file-text"></i> Script & Phụ Đề Bài Nghe</h4>
              <button id="btn-toggle-transcript" class="btn btn-sm btn-ghost"><i data-lucide="eye"></i> Bật/Tắt Phụ Đề</button>
            </div>

            <div id="transcript-body" class="transcript-body hidden">
              ${activeLesson.transcript.map(line => `
                <div class="transcript-line">
                  <p class="en-text"><i data-lucide="volume-2" class="icon-inline" onclick="window.speakSentence('${line.en.replace(/'/g, "\\'")}')"></i> ${line.en}</p>
                  <p class="vi-text">${line.vi}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Quiz & Open Reflection Prompt -->
        <div class="card glass-card fade-in">
          <div class="quiz-container">
            <h3 class="card-title"><i data-lucide="help-circle"></i> Câu Hỏi Kiểm Tra Nhận Thức</h3>
            <div id="quiz-questions-list">
              ${activeLesson.quiz.map((q, qIndex) => `
                <div class="quiz-card" data-quiz-index="${qIndex}">
                  <p class="quiz-question"><strong>Câu ${qIndex + 1}:</strong> ${q.question}</p>
                  <div class="quiz-options">
                    ${q.options.map((opt, optIndex) => `
                      <label class="option-label">
                        <input type="radio" name="quiz_${qIndex}" value="${optIndex}">
                        <span>${opt}</span>
                      </label>
                    `).join('')}
                  </div>
                  <div class="quiz-feedback hidden" id="quiz-feedback-${qIndex}"></div>
                </div>
              `).join('')}
            </div>
            
            <button id="btn-check-quiz" class="btn btn-outline glow-cyan full-width mt-md">
              <i data-lucide="check-square"></i> Nộp Bài Trắc Nghiệm
            </button>
          </div>

          <hr class="divider">

          <!-- Open Reflection Section -->
          <div class="reflection-container">
            <h3 class="card-title"><i data-lucide="message-square-heart"></i> Câu Hỏi Mở & Nêu Cảm Nhận</h3>
            <p class="reflection-prompt">"${activeLesson.reflectionPrompt}"</p>

            <textarea id="reflection-input" class="reflection-textarea" placeholder="Viết nhận định / cảm nhận của bạn bằng Tiếng Anh tại đây..."></textarea>
            
            <button id="btn-save-reflection" class="btn btn-primary glow-emerald full-width mt-sm">
              <i data-lucide="save"></i> Lưu Cảm Nhận & Hoàn Thành
            </button>
          </div>
        </div>
      </div>
    `}
  `;

  lucide.createIcons();
  attachListeningEvents(activeLesson, container);
}

function attachListeningEvents(activeLesson, container) {
  // Level filter buttons
  document.querySelectorAll(".level-pills .pill").forEach(pill => {
    pill.addEventListener("click", () => {
      stopAudio();
      selectedLevel = pill.dataset.level;
      currentLessonIndex = 0;
      renderListeningSection(container);
    });
  });

  // Play / Pause Audio Speech Synthesis
  const btnPlay = document.getElementById("btn-play-audio");
  const playIcon = document.getElementById("audio-play-icon");
  const statusText = document.getElementById("audio-status-text");
  const speedSelect = document.getElementById("audio-speed-select");

  if (btnPlay) {
    btnPlay.addEventListener("click", () => {
      if (isPlaying) {
        pauseAudio();
        statusText.textContent = "Tạm dừng phát audio";
      } else {
        playAudio(activeLesson.audioText, parseFloat(speedSelect.value));
        statusText.textContent = "Đang phát audio tiếng Anh...";
      }
    });
  }

  // Toggle Transcript
  const btnTranscript = document.getElementById("btn-toggle-transcript");
  const transcriptBody = document.getElementById("transcript-body");
  if (btnTranscript) {
    btnTranscript.addEventListener("click", () => {
      transcriptBody.classList.toggle("hidden");
    });
  }

  // Check Quiz Answers
  const btnCheckQuiz = document.getElementById("btn-check-quiz");
  if (btnCheckQuiz) {
    btnCheckQuiz.addEventListener("click", () => {
      activeLesson.quiz.forEach((q, qIndex) => {
        const selected = document.querySelector(`input[name="quiz_${qIndex}"]:checked`);
        const feedbackEl = document.getElementById(`quiz-feedback-${qIndex}`);
        feedbackEl.classList.remove("hidden");

        if (!selected) {
          feedbackEl.className = "quiz-feedback incorrect";
          feedbackEl.textContent = "Vui lòng chọn một đáp án.";
        } else {
          const answerVal = parseInt(selected.value);
          if (answerVal === q.correct) {
            feedbackEl.className = "quiz-feedback correct";
            feedbackEl.innerHTML = `✅ Đúng chính xác! ${q.explanation}`;
          } else {
            feedbackEl.className = "quiz-feedback incorrect";
            feedbackEl.innerHTML = `❌ Chưa chính xác. Đáp án đúng: <strong>${q.options[q.correct]}</strong>. (${q.explanation})`;
          }
        }
      });
    });
  }

  // Save Reflection & Mark Completed
  const btnSaveReflection = document.getElementById("btn-save-reflection");
  if (btnSaveReflection) {
    btnSaveReflection.addEventListener("click", () => {
      const text = document.getElementById("reflection-input").value.trim();
      if (!text) {
        alert("Vui lòng viết một vài dòng nhận định trước khi lưu.");
        return;
      }

      storageService.markSkillCompleted("listening");
      alert("🎉 Đã lưu nhận định của bạn và ghi nhận hoàn thành Listening hôm nay!");
    });
  }

  // Window global function to speak single sentence
  window.speakSentence = (sentence) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(sentence);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };
}

function playAudio(text, rate = 1.0) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'en-US';
    currentUtterance.rate = rate;

    currentUtterance.onend = () => {
      isPlaying = false;
      const playIcon = document.getElementById("audio-play-icon");
      const statusText = document.getElementById("audio-status-text");
      if (playIcon) playIcon.setAttribute("data-lucide", "play");
      if (statusText) statusText.textContent = "Đã phát xong bài nghe";
      lucide.createIcons();
    };

    window.speechSynthesis.speak(currentUtterance);
    isPlaying = true;
    const playIcon = document.getElementById("audio-play-icon");
    if (playIcon) playIcon.setAttribute("data-lucide", "pause");
    lucide.createIcons();
  } else {
    alert("Trình duyệt của bạn không hỗ trợ tính năng phát âm thanh SpeechSynthesis.");
  }
}

function pauseAudio() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
    isPlaying = false;
    const playIcon = document.getElementById("audio-play-icon");
    if (playIcon) playIcon.setAttribute("data-lucide", "play");
    lucide.createIcons();
  }
}

function stopAudio() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isPlaying = false;
  }
}
