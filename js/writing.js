// Writing Section Controller with Detailed AI Error-by-Error Evaluation & History Analysis
import { WRITING_TOPICS, getRandomTopic } from "./data/topics.js";
import { aiService } from "./ai-service.js";
import { storageService } from "./storage.js";

let currentTopic = null;
let timerInterval = null;
let timerSeconds = 0;

export function renderWritingSection(container) {
  const essays = storageService.getEssays();
  const goals = storageService.getUserLearningGoals();
  const levels = storageService.getUserSkillLevels();

  if (!currentTopic) {
    currentTopic = getRandomTopic(goals, levels.writing);
  }

  const goalsLabel = goals.join(", ").toUpperCase();

  container.innerHTML = `
    <div class="section-header fade-in">
      <div>
        <h2 class="section-title"><i data-lucide="pen-tool"></i> Phần 1: Writing (Luyện Viết & Chấm Lỗi Chi Tiết)</h2>
        <p class="section-subtitle">AI chấm bài, chỉ ra từng lỗi sai ngữ pháp, chính tả, cách dùng từ, hướng dẫn sửa và lưu trữ toàn bộ lịch sử học tập.</p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <span class="badge badge-purple" style="display: flex; align-items: center; gap: 0.35rem;">
          <i data-lucide="target"></i> ${goalsLabel} (${levels.writing})
        </span>
        <button id="btn-random-topic" class="btn btn-outline glow-cyan">
          <i data-lucide="shuffle"></i> Đổi Chủ Đề Mới
        </button>
      </div>
    </div>

    <div class="grid grid-2 gap-lg">
      <!-- Left Column: Topic & Editor -->
      <div class="card glass-card fade-in">
        <div class="topic-box">
          <div class="badge badge-cyan">${currentTopic.category}</div>
          <h3 class="topic-title" id="topic-title-display">${currentTopic.title}</h3>
          <p class="topic-prompt" id="topic-prompt-display">"${currentTopic.prompt}"</p>
          
          <div class="vocab-tags">
            <span class="vocab-label"><i data-lucide="sparkles"></i> Gợi ý từ vựng:</span>
            <div id="vocab-tags-container">
              ${currentTopic.suggestedVocab.map(v => `<span class="tag">${v}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Editor Toolbar -->
        <div class="editor-toolbar">
          <div class="timer-display">
            <i data-lucide="clock"></i> <span id="writing-timer">00:00</span>
            <button id="btn-toggle-timer" class="btn-icon-small" title="Bắt đầu / Tạm dừng đếm giờ"><i data-lucide="play"></i></button>
          </div>
          <div class="word-counter">
            <span id="word-count" style="font-weight: 700; color: #FFF;">0</span> / ${currentTopic.targetWordCount} từ
            <span class="text-muted">| <span id="char-count">0</span> ký tự</span>
          </div>
        </div>

        <!-- Writing Textarea -->
        <textarea id="writing-input" class="writing-textarea" placeholder="Viết bài của bạn bằng Tiếng Anh tại đây... (Nên sử dụng các từ vựng gợi ý ở trên để được cộng điểm)"></textarea>

        <div class="editor-actions">
          <button id="btn-clear-essay" class="btn btn-ghost"><i data-lucide="trash-2"></i> Xóa làm lại</button>
          <button id="btn-submit-essay" class="btn btn-primary glow-cyan"><i data-lucide="sparkles"></i> Chấm Bài & Chỉ Lỗi Bằng AI</button>
        </div>
      </div>

      <!-- Right Column: Essay History & Detailed Reviews -->
      <div class="card glass-card fade-in flex-column" style="height: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h3 class="card-title" style="margin-bottom: 0;"><i data-lucide="history"></i> Lịch Sử Bài Viết (${essays.length})</h3>
        </div>
        <p class="text-muted small">Xem lại toàn bộ bài viết, điểm số và các lỗi sai đã được AI phân tích từng ngày.</p>
        
        <div id="essay-history-list" class="essay-history-container" style="flex: 1; overflow-y: auto; margin-top: 0.75rem;">
          ${renderEssayHistoryHtml(essays)}
        </div>
      </div>
    </div>

    <!-- AI Evaluation Modal (Full Analysis & Error Breakdown) -->
    <div id="modal-essay-evaluation" class="modal-backdrop hidden">
      <div class="modal-content glass-card modal-lg fade-in p-xl">
        <button id="btn-close-modal" class="modal-close"><i data-lucide="x"></i></button>
        <div id="modal-eval-body">
          <!-- Dynamic Content -->
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
  attachWritingEvents(container);
}

function renderEssayHistoryHtml(essays) {
  if (!essays || essays.length === 0) {
    return `
      <div class="empty-state" style="text-align: center; padding: 2.5rem 1rem;">
        <i data-lucide="file-text" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
        <p class="text-muted">Bạn chưa có bài viết nào. Hãy chọn chủ đề và bấm <strong>"Chấm Bài & Chỉ Lỗi Bằng AI"</strong> để lưu bài viết đầu tiên!</p>
      </div>
    `;
  }

  return essays.map(item => {
    const errorCount = item.evaluation?.detailedErrors?.length || item.evaluation?.grammarErrors?.length || 0;
    const wordsCount = item.wordCount || item.essayText.split(/\s+/).filter(Boolean).length;

    return `
      <div class="essay-history-card" style="background: rgba(14, 22, 38, 0.7); border: 1px solid var(--border-glass); padding: 1.1rem; border-radius: var(--radius-lg); margin-bottom: 0.85rem; transition: all var(--transition-fast);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem; flex-wrap: wrap; gap: 0.35rem;">
          <div style="display: flex; align-items: center; gap: 0.45rem;">
            <span class="badge badge-purple" style="font-weight: 800;">CEFR: ${item.cefrLevel || 'B2'}</span>
            <span class="badge badge-cyan">Band ${item.overallScore || '7.0'}</span>
          </div>
          <span class="text-muted small" style="display: flex; align-items: center; gap: 0.25rem;">
            <i data-lucide="calendar" style="width: 13px; height: 13px;"></i> ${item.date}
          </span>
        </div>

        <h4 style="font-size: 1.02rem; font-weight: 700; color: #FFF; margin: 0.35rem 0;">${item.topicTitle}</h4>
        <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 0.65rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          "${item.essayText}"
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 0.65rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="badge badge-ghost" style="font-size: 0.78rem;">${wordsCount} từ</span>
            <span class="badge badge-rose" style="font-size: 0.78rem;">
              <i data-lucide="alert-circle" style="width: 12px; height: 12px;"></i> ${errorCount} lỗi sai
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.35rem;">
            <button class="btn btn-sm btn-outline glow-cyan btn-view-essay-detail" data-essay-id="${item.id}">
              <i data-lucide="eye"></i> Xem Chi Tiết & Lỗi Sai
            </button>
            <button class="btn btn-sm btn-ghost btn-delete-essay text-muted" data-essay-id="${item.id}" title="Xóa bài viết này">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function attachWritingEvents(container) {
  const textarea = container.querySelector("#writing-input");
  const wordCountEl = container.querySelector("#word-count");
  const charCountEl = container.querySelector("#char-count");
  const btnRandom = container.querySelector("#btn-random-topic");
  const btnSubmit = container.querySelector("#btn-submit-essay");
  const btnClear = container.querySelector("#btn-clear-essay");
  const btnTimer = container.querySelector("#btn-toggle-timer");

  // Realtime word/char counter
  if (textarea) {
    textarea.oninput = () => {
      const text = textarea.value;
      const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
      wordCountEl.textContent = words;
      charCountEl.textContent = text.length;

      if (!timerInterval && text.length > 0) {
        startTimer(container);
      }
    };
  }

  // Random topic
  if (btnRandom) {
    btnRandom.onclick = () => {
      const goals = storageService.getUserLearningGoals();
      const levels = storageService.getUserSkillLevels();
      currentTopic = getRandomTopic(goals, levels.writing);
      container.querySelector("#topic-title-display").textContent = currentTopic.title;
      container.querySelector("#topic-prompt-display").textContent = `"${currentTopic.prompt}"`;
      container.querySelector("#vocab-tags-container").innerHTML = currentTopic.suggestedVocab.map(v => `<span class="tag">${v}</span>`).join('');
      if (textarea) textarea.value = "";
      wordCountEl.textContent = "0";
      charCountEl.textContent = "0";
      resetTimer(container);
    };
  }

  // Clear
  if (btnClear) {
    btnClear.onclick = () => {
      if (confirm("Bạn có chắc chắn muốn xóa nội dung đang viết?")) {
        if (textarea) textarea.value = "";
        wordCountEl.textContent = "0";
        charCountEl.textContent = "0";
        resetTimer(container);
      }
    };
  }

  // Timer toggle
  if (btnTimer) {
    btnTimer.onclick = () => {
      if (timerInterval) {
        pauseTimer();
        btnTimer.innerHTML = '<i data-lucide="play"></i>';
      } else {
        startTimer(container);
        btnTimer.innerHTML = '<i data-lucide="pause"></i>';
      }
      lucide.createIcons();
    };
  }

  // Submit Essay with Detailed AI Evaluation
  if (btnSubmit && textarea) {
    btnSubmit.onclick = async () => {
      const essayText = textarea.value.trim();
      if (!essayText || essayText.split(/\s+/).filter(Boolean).length < 5) {
        alert("Vui lòng viết ít nhất một đoạn văn ngắn trước khi gửi bài chấm điểm.");
        return;
      }

      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<span class="spinner-sm"></span> AI đang phân tích từng câu & tìm lỗi sai...`;

      try {
        const result = await aiService.evaluateEssay(currentTopic.title, currentTopic.prompt, essayText);
        pauseTimer();

        // Save essay to history with complete detailed evaluation
        const savedItem = storageService.saveEssay({
          topicTitle: currentTopic.title,
          topicPrompt: currentTopic.prompt,
          category: currentTopic.category,
          essayText: essayText,
          wordCount: essayText.trim().split(/\s+/).filter(Boolean).length,
          cefrLevel: result.cefrLevel,
          overallScore: result.overallScore,
          evaluation: result
        });

        showEvaluationModal(result, savedItem, container);
        renderWritingSection(container);
      } catch (err) {
        alert("Lỗi chấm bài: " + err.message);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<i data-lucide="sparkles"></i> Chấm Bài & Chỉ Lỗi Bằng AI`;
        lucide.createIcons();
      }
    };
  }

  // History Actions: View Detail & Delete
  container.querySelectorAll(".btn-view-essay-detail").forEach(btn => {
    btn.onclick = () => {
      const essayId = btn.dataset.essayId;
      const essays = storageService.getEssays();
      const found = essays.find(e => e.id === essayId);
      if (found && found.evaluation) {
        showEvaluationModal(found.evaluation, found, container);
      }
    };
  });

  container.querySelectorAll(".btn-delete-essay").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const essayId = btn.dataset.essayId;
      if (confirm("Bạn có chắc muốn xóa bài viết này khỏi lịch sử?")) {
        storageService.deleteEssay(essayId);
        renderWritingSection(container);
      }
    };
  });
}

function showEvaluationModal(evalData, essayObj, container) {
  const modal = document.getElementById("modal-essay-evaluation") || container.querySelector("#modal-essay-evaluation");
  const modalBody = document.getElementById("modal-eval-body") || container.querySelector("#modal-eval-body");
  if (!modal || !modalBody) return;

  const errors = evalData.detailedErrors || evalData.grammarErrors || [];
  const vocabList = evalData.vocabSuggestions || [];
  const criteria = evalData.criteriaScores || {
    taskResponse: evalData.overallScore || 7.0,
    coherenceCohesion: evalData.overallScore || 7.0,
    lexicalResource: evalData.overallScore || 7.0,
    grammaticalAccuracy: evalData.overallScore || 7.0
  };

  modalBody.innerHTML = `
    <!-- Header: Score & CEFR Level -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
          <span class="badge badge-purple" style="font-size: 0.95rem; font-weight: 800;">CEFR: ${evalData.cefrLevel || 'B2'}</span>
          <span class="badge badge-cyan" style="font-size: 0.95rem; font-weight: 800;">Band Điểm: ${evalData.overallScore || '7.0'} / 9.0</span>
          <span class="badge badge-rose" style="font-size: 0.85rem;">${errors.length} Lỗi Cần Sửa</span>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #FFF; margin: 0;">${essayObj.topicTitle || 'Đánh Giá Bài Viết'}</h3>
        <p class="text-muted small" style="margin-top: 0.2rem;">Ngày làm bài: ${essayObj.date || 'Hôm nay'} | Tổng số từ: ${essayObj.wordCount || essayObj.essayText.split(/\s+/).filter(Boolean).length} từ</p>
      </div>

      <button id="btn-listen-improved-essay" class="btn btn-sm btn-outline glow-cyan" title="Nghe AI đọc bài viết chuẩn">
        <i data-lucide="volume-2"></i> Nghe Bài Đã Trau Chuốt
      </button>
    </div>

    <!-- Criteria Breakdown Grid -->
    <div class="essay-criteria-grid">
      <div class="criteria-item">
        <div class="criteria-score">${criteria.taskResponse || 7.0}</div>
        <div class="criteria-name">Task Response</div>
      </div>
      <div class="criteria-item">
        <div class="criteria-score">${criteria.coherenceCohesion || 7.0}</div>
        <div class="criteria-name">Coherence & Cohesion</div>
      </div>
      <div class="criteria-item">
        <div class="criteria-score">${criteria.lexicalResource || 7.0}</div>
        <div class="criteria-name">Lexical Resource</div>
      </div>
      <div class="criteria-item">
        <div class="criteria-score">${criteria.grammaticalAccuracy || 7.0}</div>
        <div class="criteria-name">Grammar Accuracy</div>
      </div>
    </div>

    <!-- Section 1: Original Submission -->
    <div class="eval-section">
      <h4 class="eval-subtitle"><i data-lucide="file-text" class="icon-cyan"></i> Bài Viết Gốc Của Bạn</h4>
      <div style="background: rgba(0, 0, 0, 0.35); padding: 0.95rem 1.1rem; border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.05); color: #E2E8F0; font-size: 0.92rem; line-height: 1.65; white-space: pre-wrap;">${essayObj.essayText}</div>
    </div>

    <!-- Section 2: Summary & Strengths -->
    <div class="eval-section">
      <h4 class="eval-subtitle"><i data-lucide="award" class="icon-amber"></i> Nhận Xét & Đánh Giá Tổng Thể</h4>
      <p style="color: var(--text-main); line-height: 1.6; font-size: 0.92rem;">${evalData.summaryFeedback}</p>
      ${evalData.strengths ? `
        <div style="margin-top: 0.65rem; background: rgba(16, 185, 129, 0.08); border-left: 3px solid var(--accent-emerald); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm);">
          <strong style="color: #34D399; font-size: 0.85rem;">✨ Điểm mạnh:</strong>
          <p style="color: #D1FAE5; font-size: 0.86rem; margin: 0.2rem 0 0 0;">${evalData.strengths}</p>
        </div>
      ` : ''}
      ${evalData.areasToImprove ? `
        <div style="margin-top: 0.5rem; background: rgba(245, 158, 11, 0.08); border-left: 3px solid var(--accent-amber); padding: 0.65rem 0.85rem; border-radius: var(--radius-sm);">
          <strong style="color: #FBBF24; font-size: 0.85rem;">🎯 Điểm cần cải thiện:</strong>
          <p style="color: #FEF3C7; font-size: 0.86rem; margin: 0.2rem 0 0 0;">${evalData.areasToImprove}</p>
        </div>
      ` : ''}
    </div>

    <!-- Section 3: Detailed Error Breakdown (Chỉ ra từng lỗi, cách sửa và giải thích) -->
    <div class="eval-section">
      <h4 class="eval-subtitle">
        <i data-lucide="alert-triangle" class="icon-rose"></i> Danh Sách Chi Tiết Từng Lỗi Sai & Cách Sửa (${errors.length} lỗi)
      </h4>
      <p class="text-muted small">Nhấp đọc kỹ từng lỗi sai để nắm vững quy tắc ngữ pháp và tránh mắc lại trong các bài viết tiếp theo.</p>

      <div class="error-list-detailed">
        ${errors.map((err, idx) => `
          <div class="error-card-detailed">
            <div class="error-card-header">
              <span class="error-type-badge">
                <i data-lucide="alert-circle" style="width: 14px; height: 14px;"></i> Lỗi #${idx + 1}: ${err.type || 'Ngữ Pháp'}
              </span>
              ${err.rule ? `<span class="error-rule-tag">${err.rule}</span>` : ''}
            </div>

            <div class="error-comparison-grid">
              <div class="error-box-original">
                <div class="label-sub">❌ Đoạn Lỗi Của Bạn</div>
                <div class="text-content">"${err.original}"</div>
              </div>
              <div class="error-box-corrected">
                <div class="label-sub">✅ Cách Sửa Chuẩn Xác</div>
                <div class="text-content">"${err.corrected}"</div>
              </div>
            </div>

            <div class="error-box-explanation">
              <strong>💡 Giải thích chi tiết:</strong> ${err.explanation}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Section 4: Advanced Vocabulary Suggestions -->
    ${vocabList.length > 0 ? `
      <div class="eval-section">
        <h4 class="eval-subtitle"><i data-lucide="zap" class="icon-cyan"></i> Gợi Ý Nâng Cấp Từ Vựng Học Thuật (B2-C1)</h4>
        <div class="vocab-suggestions" style="display: flex; flex-direction: column; gap: 0.65rem; margin-top: 0.65rem;">
          ${vocabList.map(v => `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-glass); padding: 0.75rem 1rem; border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 0.25rem;">
              <div>
                <span class="text-muted">Thay vì dùng: </span><s style="color: #FB7185;">"${v.original}"</s>
                <span class="text-muted"> ➔ Nên dùng: </span><strong style="color: var(--accent-cyan-light); font-size: 0.95rem;">${v.suggested}</strong>
              </div>
              <p class="text-secondary small" style="margin: 0;">${v.reason}</p>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Section 5: Polished Model Version -->
    <div class="eval-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
        <h4 class="eval-subtitle" style="margin-bottom: 0;"><i data-lucide="sparkles" class="icon-violet"></i> Bài Luận Đã Trau Chuốt Hoàn Chỉnh (Polished Native Version)</h4>
      </div>
      <div class="polished-box">
        <p style="white-space: pre-wrap; margin: 0; color: #F1F5F9;">${evalData.improvedEssay}</p>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  lucide.createIcons();

  // Listen button on improved essay
  const btnListen = modalBody.querySelector("#btn-listen-improved-essay");
  if (btnListen) {
    btnListen.onclick = () => {
      window.speakSentence(evalData.improvedEssay);
    };
  }

  // Close modal button
  const btnClose = modal.querySelector("#btn-close-modal");
  if (btnClose) {
    btnClose.onclick = () => {
      modal.classList.add("hidden");
    };
  }
}

function startTimer(container) {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerSeconds++;
    const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
    const secs = String(timerSeconds % 60).padStart(2, '0');
    const timerEl = container.querySelector("#writing-timer") || document.getElementById("writing-timer");
    if (timerEl) timerEl.textContent = `${mins}:${secs}`;
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer(container) {
  pauseTimer();
  timerSeconds = 0;
  const timerEl = container.querySelector("#writing-timer") || document.getElementById("writing-timer");
  if (timerEl) timerEl.textContent = "00:00";
}
