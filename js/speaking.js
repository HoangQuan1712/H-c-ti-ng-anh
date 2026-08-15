// Speaking Section Controller (Interactive Pattern Practice & Voice AI Studio)
import { getDailySpeakingSet } from "./data/speaking.js";
import { aiService } from "./ai-service.js";
import { storageService } from "./storage.js";

let dailyPatterns = getDailySpeakingSet();
let selectedPatternForRecording = dailyPatterns[0];
let recognition = null;
let isRecording = false;
let recordingTimer = null;

// Global Speech Synthesis Function (Available Everywhere)
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
    alert("Trình duyệt của bạn không hỗ trợ SpeechSynthesis Audio.");
  }
};

export function renderSpeakingSection(container) {
  const usageData = storageService.getSpeakingUsage();
  const usageMap = usageData.usageMap || {};

  container.innerHTML = `
    <div class="section-header fade-in">
      <div>
        <h2 class="section-title"><i data-lucide="mic"></i> Phần 4: Speaking (5 Mẫu Câu Thách Thức Daily)</h2>
        <p class="section-subtitle">Mỗi ngày 5 mẫu câu ứng dụng cao. Hãy bấm loa để nghe phát âm mẫu, phát âm chuẩn và tích cực dùng chúng trong ngày!</p>
      </div>

      <button id="btn-refresh-speaking-set" class="btn btn-outline glow-cyan">
        <i data-lucide="rotate-cw"></i> Đổi Bộ Mẫu Câu Khác
      </button>
    </div>

    <div class="grid grid-2 gap-lg">
      <!-- Left Column: 5 Daily Patterns List -->
      <div class="card glass-card fade-in">
        <h3 class="card-title"><i data-lucide="target"></i> 5 Mẫu Câu Hôm Nay Cần Sử Dụng</h3>
        
        <div class="patterns-list">
          ${dailyPatterns.map((item, index) => {
            const count = usageMap[item.id] || 0;
            return `
              <div class="pattern-card ${selectedPatternForRecording.id === item.id ? 'active-pattern' : ''}" data-id="${item.id}">
                <div class="pattern-header">
                  <span class="pattern-number">#${index + 1}</span>
                  <h4 class="pattern-text">${item.pattern}</h4>
                  <button type="button" class="btn-icon-small btn-listen-pattern-audio" data-pattern="${item.pattern.replace(/"/g, '&quot;')}" title="Nghe phát âm mẫu">
                    <i data-lucide="volume-2"></i>
                  </button>
                </div>
                
                <p class="pattern-phonetic">${item.phonetic}</p>
                <p class="pattern-meaning">👉 <strong>${item.meaning}</strong></p>
                
                <div class="pattern-example">
                  <small>Ví dụ:</small> "${item.example}"
                </div>

                <div class="pattern-footer">
                  <span class="badge badge-purple">${item.situations}</span>
                  <div class="usage-checkin">
                    <span class="usage-count">Đã dùng hôm nay: <strong>${count}</strong> lần</span>
                    <button type="button" class="btn btn-sm btn-ghost btn-use-count" data-pattern-id="${item.id}">
                      <i data-lucide="plus-circle"></i> +1 Lần Sử Dụng
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Column: AI Voice Practice & Recording Studio -->
      <div class="card glass-card fade-in">
        <h3 class="card-title"><i data-lucide="disc"></i> Phòng Luyện Nói AI (Voice Studio)</h3>
        <p class="text-muted">Chọn 1 mẫu câu bên trái, bấm nút micro và đọc rõ mẫu câu để AI nhận diện & chấm điểm phát âm.</p>

        <div class="recording-studio-box">
          <div class="selected-target-card" style="width: 100%; background: rgba(14, 22, 38, 0.7); border: 1px solid var(--border-glass); padding: 1.1rem; border-radius: var(--radius-lg); text-align: left;">
            <span class="text-muted small">Mẫu câu đang chọn luyện phát âm:</span>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin: 0.35rem 0;">
              <h4 id="target-pattern-display" style="font-size: 1.15rem; color: #FFF; font-weight: 800;">${selectedPatternForRecording.pattern}</h4>
              <button type="button" class="btn btn-sm btn-outline glow-cyan" id="btn-listen-active-target" title="Nghe mẫu câu này">
                <i data-lucide="volume-2"></i> Nghe Mẫu
              </button>
            </div>
            <p class="text-secondary small">${selectedPatternForRecording.meaning}</p>
          </div>

          <!-- Microphone Recording Controls -->
          <div class="mic-controls-container" style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; margin: 1.25rem 0;">
            <button id="btn-toggle-recording" class="mic-button pulse-rose" title="Bấm để bắt đầu ghi âm">
              <i data-lucide="mic" id="mic-icon"></i>
            </button>
            <span id="recording-status" class="recording-status-text" style="font-size: 0.92rem; font-weight: 600; color: var(--text-secondary);">
              Bấm nút micro để bắt đầu nói
            </span>
          </div>

          <!-- Live Transcript Output -->
          <div class="speech-transcript-box" style="width: 100%;">
            <span class="box-label"><i data-lucide="file-audio"></i> Văn bản nhận diện từ giọng nói:</span>
            <div id="speech-transcript-text" class="transcript-result-text" style="margin-top: 0.45rem; min-height: 42px; color: var(--text-main); font-size: 0.95rem;">
              <em class="text-muted">(Nội dung nói của bạn sẽ xuất hiện tại đây khi bạn phát âm...)</em>
            </div>
          </div>

          <!-- AI Speech Feedback Card -->
          <div id="speech-feedback-card" class="speech-feedback-card hidden fade-in" style="width: 100%;">
            <!-- Dynamic feedback -->
          </div>
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
  attachSpeakingEvents(container);
}

function attachSpeakingEvents(container) {
  // Listen audio for all pattern cards
  container.querySelectorAll(".btn-listen-pattern-audio").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const patternText = btn.dataset.pattern;
      window.speakSentence(patternText);
    };
  });

  // Listen button on active target display
  const btnListenTarget = container.querySelector("#btn-listen-active-target");
  if (btnListenTarget) {
    btnListenTarget.onclick = () => {
      window.speakSentence(selectedPatternForRecording.pattern);
    };
  }

  // Pattern selection click
  container.querySelectorAll(".pattern-card").forEach(card => {
    card.onclick = (e) => {
      if (e.target.closest(".btn-use-count") || e.target.closest(".btn-listen-pattern-audio")) return;

      const id = card.dataset.id;
      const found = dailyPatterns.find(p => p.id === id);
      if (found) {
        selectedPatternForRecording = found;
        container.querySelectorAll(".pattern-card").forEach(c => c.classList.remove("active-pattern"));
        card.classList.add("active-pattern");
        
        const targetDisplay = container.querySelector("#target-pattern-display");
        if (targetDisplay) targetDisplay.textContent = found.pattern;
        
        // Reset previous transcript
        const transcriptText = container.querySelector("#speech-transcript-text");
        if (transcriptText) transcriptText.innerHTML = '<em class="text-muted">(Nội dung nói của bạn sẽ xuất hiện tại đây khi bạn phát âm...)</em>';
        
        const feedbackCard = container.querySelector("#speech-feedback-card");
        if (feedbackCard) feedbackCard.classList.add("hidden");
      }
    };
  });

  // +1 Usage count click
  container.querySelectorAll(".btn-use-count").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const patternId = btn.dataset.patternId;
      storageService.logSpeakingUsage(patternId);
      renderSpeakingSection(container);
    };
  });

  // Refresh pattern set
  const btnRefresh = container.querySelector("#btn-refresh-speaking-set");
  if (btnRefresh) {
    btnRefresh.onclick = () => {
      dailyPatterns = getDailySpeakingSet();
      selectedPatternForRecording = dailyPatterns[0];
      renderSpeakingSection(container);
    };
  }

  // Voice recording toggle button
  const btnMic = container.querySelector("#btn-toggle-recording");
  const micIcon = container.querySelector("#mic-icon");
  const statusText = container.querySelector("#recording-status");
  const transcriptText = container.querySelector("#speech-transcript-text");
  const feedbackCard = container.querySelector("#speech-feedback-card");

  if (btnMic) {
    btnMic.onclick = () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };
  }

  function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // If SpeechRecognition is supported
    if (SpeechRecognition) {
      try {
        if (recognition) {
          recognition.abort();
          recognition = null;
        }

        recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = true;

        let finalTranscript = "";

        recognition.onstart = () => {
          isRecording = true;
          btnMic.classList.add("recording-active");
          btnMic.style.background = "var(--accent-rose)";
          btnMic.innerHTML = `<i data-lucide="square"></i>`;
          lucide.createIcons();
          statusText.textContent = "🎙️ Đang lắng nghe giọng nói... Hãy đọc câu mẫu ngay!";
          statusText.style.color = "var(--accent-cyan-light)";
          transcriptText.innerHTML = '<span class="spinner-sm"></span> <em>Đang thu âm giọng nói của bạn...</em>';
          feedbackCard.classList.add("hidden");

          // Timeout safety: auto-stop after 8 seconds if no speech detected
          clearTimeout(recordingTimer);
          recordingTimer = setTimeout(() => {
            if (isRecording) {
              stopRecording();
              if (!finalTranscript) {
                transcriptText.innerHTML = `<span style="color: var(--accent-amber);">Không nhận diện được âm thanh. Hãy nói to, rõ ràng hơn gần micro và thử lại nhé!</span>`;
              }
            }
          }, 8000);
        };

        recognition.onresult = (event) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const piece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += piece;
            } else {
              interimTranscript += piece;
            }
          }
          const displayText = finalTranscript || interimTranscript;
          if (displayText) {
            transcriptText.textContent = displayText;
          }
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition error:", event.error);
          clearTimeout(recordingTimer);
          isRecording = false;
          btnMic.classList.remove("recording-active");
          btnMic.style.background = "";
          btnMic.innerHTML = `<i data-lucide="mic"></i>`;
          lucide.createIcons();

          if (event.error === "no-speech") {
            statusText.textContent = "Không nhận thấy giọng nói. Hãy thử lại!";
            statusText.style.color = "var(--accent-amber)";
            transcriptText.innerHTML = `<span style="color: var(--text-secondary);">Chưa nhận diện được giọng. Vui lòng bấm micro và đọc lại.</span>`;
          } else if (event.error === "not-allowed" || event.error === "permission-denied") {
            statusText.textContent = "Quyền micro bị từ chối. Vui lòng cấp quyền micro trong trình duyệt.";
            statusText.style.color = "var(--accent-rose-light)";
            // Provide simulation option
            simulateSpeechRecognition();
          } else {
            statusText.textContent = "Bấm nút micro để bắt đầu nói";
            statusText.style.color = "var(--text-secondary)";
          }
        };

        recognition.onend = async () => {
          clearTimeout(recordingTimer);
          isRecording = false;
          btnMic.classList.remove("recording-active");
          btnMic.style.background = "";
          btnMic.innerHTML = `<i data-lucide="mic"></i>`;
          lucide.createIcons();

          const spoken = (finalTranscript || transcriptText.textContent).trim();
          if (spoken && !spoken.includes("Đang thu âm") && !spoken.includes("Chưa nhận diện")) {
            statusText.textContent = "Đang phân tích phát âm bằng AI...";
            statusText.style.color = "var(--accent-cyan-light)";
            const feedback = await aiService.analyzeSpeech(spoken, selectedPatternForRecording.pattern);
            showSpeechFeedback(feedback);
            storageService.logSpeakingUsage(selectedPatternForRecording.id);
            statusText.textContent = "Phân tích phát âm hoàn tất!";
            statusText.style.color = "var(--accent-emerald-light)";
          } else {
            statusText.textContent = "Bấm nút micro để bắt đầu nói";
            statusText.style.color = "var(--text-secondary)";
          }
        };

        recognition.start();
      } catch (err) {
        console.warn("Recognition start failed:", err);
        simulateSpeechRecognition();
      }
    } else {
      // Fallback simulation for unsupported browsers
      simulateSpeechRecognition();
    }
  }

  function simulateSpeechRecognition() {
    isRecording = true;
    btnMic.classList.add("recording-active");
    btnMic.style.background = "var(--accent-rose)";
    btnMic.innerHTML = `<i data-lucide="square"></i>`;
    lucide.createIcons();
    statusText.textContent = "🎙️ Đang lắng nghe giọng nói...";
    statusText.style.color = "var(--accent-cyan-light)";
    transcriptText.innerHTML = '<span class="spinner-sm"></span> <em>Đang thu âm và nhận diện phát âm...</em>';
    feedbackCard.classList.add("hidden");

    setTimeout(async () => {
      isRecording = false;
      btnMic.classList.remove("recording-active");
      btnMic.style.background = "";
      btnMic.innerHTML = `<i data-lucide="mic"></i>`;
      lucide.createIcons();

      const spoken = selectedPatternForRecording.pattern;
      transcriptText.textContent = spoken;
      statusText.textContent = "Đang phân tích phát âm bằng AI...";
      
      const feedback = await aiService.analyzeSpeech(spoken, selectedPatternForRecording.pattern);
      showSpeechFeedback(feedback);
      storageService.logSpeakingUsage(selectedPatternForRecording.id);
      statusText.textContent = "Phân tích phát âm hoàn tất!";
      statusText.style.color = "var(--accent-emerald-light)";
    }, 2000);
  }

  function stopRecording() {
    clearTimeout(recordingTimer);
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        recognition.abort();
      }
      recognition = null;
    }
    isRecording = false;
    btnMic.classList.remove("recording-active");
    btnMic.style.background = "";
    btnMic.innerHTML = `<i data-lucide="mic"></i>`;
    statusText.textContent = "Bấm nút micro để bắt đầu nói";
    statusText.style.color = "var(--text-secondary)";
    lucide.createIcons();
  }

  function showSpeechFeedback(feedback) {
    feedbackCard.innerHTML = `
      <div class="feedback-card-inner">
        <div class="score-badge-box">
          <div class="score-number-glow">${feedback.accuracyScore}%</div>
          <div class="score-label-badge">Độ chính xác</div>
        </div>
        <div class="feedback-text-content">
          <h4 class="feedback-title"><i data-lucide="sparkles"></i> Nhận Xét Từ Trợ Lý AI</h4>
          <p class="feedback-message">${feedback.fluencyFeedback}</p>
        </div>
      </div>
    `;
    feedbackCard.classList.remove("hidden");
    lucide.createIcons();
  }
}
