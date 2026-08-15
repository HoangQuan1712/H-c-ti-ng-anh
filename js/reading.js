// Reading Section Controller with Audio Narration Player, Bookmarks & Saved Lessons
import { getRandomReadingArticle, READING_ARTICLES } from "./data/reading.js";
import { aiService } from "./ai-service.js";
import { storageService } from "./storage.js";

let currentArticle = getRandomReadingArticle();
let chatHistory = [];
let isArticleAudioPlaying = false;
let currentParagraphIndex = -1;

export function renderReadingSection(container) {
  // Cancel any ongoing audio when re-rendering
  stopArticleAudio();

  const isSaved = storageService.isArticleSaved(currentArticle.id);
  const savedArticles = storageService.getSavedArticles();

  container.innerHTML = `
    <div class="section-header fade-in">
      <div>
        <h2 class="section-title"><i data-lucide="book-open"></i> Phần 3: Reading (Luyện Đọc & Bàn Luận)</h2>
        <p class="section-subtitle">Đọc bài đọc tiếng Anh mỗi ngày, nghe AI đọc chuẩn bản xứ, tra từ trực tiếp và bàn luận chuyên sâu với Trợ lý Bot.</p>
      </div>

      <div class="reading-header-actions" style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
        <!-- Save Article Button -->
        <button id="btn-toggle-save-article" class="btn ${isSaved ? 'btn-primary glow-emerald' : 'btn-outline glow-violet'}" title="${isSaved ? 'Nhấp để bỏ lưu bài học' : 'Nhấp để lưu bài học này'}">
          <i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark-plus'}"></i>
          <span id="save-article-text">${isSaved ? 'Đã Lưu Bài Học' : 'Lưu Bài Học Này'}</span>
        </button>

        <!-- View Saved Articles Button -->
        <button id="btn-open-saved-articles" class="btn btn-outline glow-cyan" title="Xem danh sách các bài đọc bạn đã lưu">
          <i data-lucide="folder-heart"></i>
          <span>Bài Học Đã Lưu (${savedArticles.length})</span>
        </button>

        <!-- Refresh / Daily Reading -->
        <button id="btn-daily-reading" class="btn btn-outline glow-violet">
          <i data-lucide="sparkles"></i> Lấy Bài Đọc Khác
        </button>
      </div>
    </div>

    <div class="reading-split-grid">
      <!-- Left Column: Article Display & Word Lookup (Glass Card with internal scroll) -->
      <div class="card glass-card reading-pane-left fade-in">
        <div class="article-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span class="badge badge-purple">${currentArticle.category}</span>
          <span class="text-muted small"><i data-lucide="clock"></i> ${currentArticle.readTime}</span>
        </div>

        <h3 class="article-title" id="article-title" style="font-size: 1.35rem; font-weight: 800; color: #FFF; margin-bottom: 0.35rem;">${currentArticle.title}</h3>
        <p class="article-tip"><i data-lucide="info"></i> <em>Mẹo: Bấm nút loa cạnh mỗi đoạn hoặc nút "Nghe Đọc Bài Viết" để nghe AI đọc chuẩn giọng bản xứ; nhấp đúp từ bất kỳ để tra nghĩa & lưu!</em></p>

        <!-- Audio Player Toolbar -->
        <div class="reading-audio-bar">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <button id="btn-toggle-reading-audio" class="btn btn-sm btn-primary glow-cyan" title="Nghe đọc toàn bộ bài viết">
              <i data-lucide="headphones" id="audio-play-icon"></i>
              <span id="audio-play-text">Nghe Đọc Bài Viết</span>
            </button>
            <button id="btn-stop-reading-audio" class="btn btn-sm btn-ghost hidden" title="Dừng đọc">
              <i data-lucide="square"></i> Dừng
            </button>
          </div>
          
          <div class="audio-controls-right" style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="text-muted small"><i data-lucide="gauge"></i> Tốc độ:</span>
            <select id="reading-audio-rate" class="form-select" style="padding: 0.25rem 0.65rem; font-size: 0.82rem; width: auto; border-radius: var(--radius-sm);">
              <option value="0.8">0.8x (Chậm)</option>
              <option value="0.95" selected>1.0x (Tự Nhiên)</option>
              <option value="1.15">1.2x (Nhanh)</option>
            </select>
            <div id="audio-live-status" class="text-secondary small" style="display: flex; align-items: center; gap: 0.4rem;">
              <span class="audio-wave-anim hidden" id="audio-wave-indicator"><span></span><span></span><span></span></span>
              <span id="audio-status-label">Sẵn sàng phát</span>
            </div>
          </div>
        </div>

        <!-- Article Body -->
        <div id="article-content" class="article-content" style="margin: 1.25rem 0; width: 100%;">
          ${formatArticleParagraphs(currentArticle.content)}
        </div>

        <hr class="divider" style="border: 0; border-top: 1px solid var(--border-glass); margin: 1.5rem 0;">

        <!-- Article Key Vocabulary -->
        <div class="article-vocab-box" style="width: 100%;">
          <h4 style="display: flex; align-items: center; gap: 0.5rem; color: #FFF; margin-bottom: 0.75rem;">
            <i data-lucide="book-marked" class="icon-cyan"></i> Từ Vựng Trọng Tâm Bài Đọc
          </h4>
          <div class="vocab-grid">
            ${currentArticle.vocabulary.map(v => `
              <div class="vocab-card-mini" onclick="window.saveQuickVocab('${v.word}', '${v.pos}', '${v.meaning.replace(/'/g, "\\'")}', '${v.phonetic}')" title="Nhấp để lưu vào sổ từ vựng">
                <div class="vocab-mini-top">
                  <div class="vocab-mini-word-wrap">
                    <strong class="vocab-mini-term">${v.word}</strong>
                    <span class="vocab-mini-pos">(${v.pos})</span>
                  </div>
                  <span class="save-icon-pill" title="Lưu vào sổ từ vựng"><i data-lucide="bookmark-plus"></i></span>
                </div>
                <div class="vocab-mini-phonetic">${v.phonetic}</div>
                <div class="vocab-meaning">${v.meaning}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive AI Discussion Bot (Glass Card with Pinned Bottom Input) -->
      <div class="card glass-card reading-pane-right fade-in">
        <h3 class="card-title"><i data-lucide="bot"></i> Bàn Luận Tiếng Anh Cùng Trợ Lý Bot</h3>
        <p class="text-muted small">Nhập suy nghĩ, nhận định của bạn về bài viết trên bằng tiếng Anh để trao đổi cùng bot.</p>

        <!-- Chat History Window (Scrolls independently) -->
        <div id="chat-messages-container" class="chat-messages">
          <div class="chat-message bot-message fade-in">
            <div class="avatar"><i data-lucide="bot"></i></div>
            <div class="message-bubble">
              <p>Hi there! I hope you enjoyed reading <strong>"${currentArticle.title}"</strong>.</p>
              <p>${currentArticle.discussionStarter}</p>
            </div>
          </div>
        </div>

        <!-- Chat Input Form (Always pinned at bottom of right pane) -->
        <div class="chat-input-box">
          <textarea id="chat-user-input" class="chat-textarea" placeholder="Nhập suy nghĩ / câu trả lời của bạn bằng Tiếng Anh..."></textarea>
          <button id="btn-send-chat" class="btn btn-primary glow-violet">
            <i data-lucide="send"></i> Gửi
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Dictionary Popover Modal -->
    <div id="dictionary-modal" class="dictionary-popover hidden">
      <div class="popover-header">
        <span id="dict-word" class="dict-word-title">Word</span>
        <button id="btn-close-dict" class="btn-icon-small"><i data-lucide="x"></i></button>
      </div>
      <div id="dict-body" class="popover-body">
        <!-- Definition content -->
      </div>
    </div>

    <!-- Saved Reading Articles Modal -->
    <div id="saved-articles-modal" class="modal-backdrop hidden">
      <div class="modal-content glass-card p-xl" style="max-width: 680px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem;">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #FFF; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="folder-heart" class="icon-violet"></i> Danh Sách Bài Học Reading Đã Lưu
          </h3>
          <button id="btn-close-saved-articles" class="btn-icon-small"><i data-lucide="x"></i></button>
        </div>

        <div id="saved-articles-list" style="display: flex; flex-direction: column; gap: 0.85rem; max-height: 420px; overflow-y: auto;">
          <!-- Rendered dynamically -->
        </div>
      </div>
    </div>
  `;

  lucide.createIcons();
  attachReadingEvents(container);
}

function formatArticleParagraphs(text) {
  return text.split("\n\n").map((para, idx) => `
    <div class="article-paragraph-block" data-para-idx="${idx}">
      <p class="article-paragraph">${para}</p>
      <button type="button" class="btn-icon-small btn-listen-para" data-para-idx="${idx}" title="Nghe đọc đoạn này">
        <i data-lucide="volume-2"></i>
      </button>
    </div>
  `).join('');
}

function attachReadingEvents(container) {
  // Audio Player Controls
  const btnToggleAudio = container.querySelector("#btn-toggle-reading-audio");
  const btnStopAudio = container.querySelector("#btn-stop-reading-audio");
  const playText = container.querySelector("#audio-play-text");
  const playIcon = container.querySelector("#audio-play-icon");
  const statusLabel = container.querySelector("#audio-status-label");
  const waveIndicator = container.querySelector("#audio-wave-indicator");
  const rateSelect = container.querySelector("#reading-audio-rate");

  const paragraphs = currentArticle.content.split("\n\n");

  if (btnToggleAudio) {
    btnToggleAudio.onclick = () => {
      if (isArticleAudioPlaying) {
        stopArticleAudio();
      } else {
        startArticleAudio(0);
      }
    };
  }

  if (btnStopAudio) {
    btnStopAudio.onclick = () => {
      stopArticleAudio();
    };
  }

  // Individual Paragraph audio buttons
  container.querySelectorAll(".btn-listen-para").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.paraIdx, 10);
      stopArticleAudio();
      playSingleParagraph(idx);
    };
  });

  function startArticleAudio(startIndex = 0) {
    if (!('speechSynthesis' in window)) {
      alert("Trình duyệt của bạn không hỗ trợ tính năng đọc âm thanh SpeechSynthesis.");
      return;
    }

    window.speechSynthesis.cancel();
    isArticleAudioPlaying = true;
    currentParagraphIndex = startIndex;

    btnToggleAudio.classList.remove("btn-primary", "glow-cyan");
    btnToggleAudio.classList.add("btn-secondary");
    playText.textContent = "Tạm Dừng";
    playIcon.setAttribute("data-lucide", "pause");
    btnStopAudio.classList.remove("hidden");
    statusLabel.textContent = `Đang đọc đoạn ${startIndex + 1}/${paragraphs.length}...`;
    statusLabel.style.color = "var(--accent-cyan-light)";
    waveIndicator.classList.remove("hidden");
    lucide.createIcons();

    playParagraphChain(startIndex);
  }

  function playParagraphChain(index) {
    if (!isArticleAudioPlaying || index >= paragraphs.length) {
      stopArticleAudio();
      statusLabel.textContent = "Đã đọc xong bài viết!";
      statusLabel.style.color = "var(--accent-emerald-light)";
      return;
    }

    currentParagraphIndex = index;
    highlightParagraph(index);
    statusLabel.textContent = `Đang đọc đoạn ${index + 1}/${paragraphs.length}...`;

    const textToRead = (index === 0 ? `${currentArticle.title}. ` : "") + paragraphs[index];
    const rate = parseFloat(rateSelect.value) || 0.95;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "en-US";
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const enVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("US") || v.name.includes("UK") || v.name.includes("English")));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => {
      if (isArticleAudioPlaying) {
        playParagraphChain(index + 1);
      }
    };

    utterance.onerror = () => {
      stopArticleAudio();
    };

    window.speechSynthesis.speak(utterance);
  }

  function playSingleParagraph(index) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    isArticleAudioPlaying = true;
    currentParagraphIndex = index;

    highlightParagraph(index);
    btnStopAudio.classList.remove("hidden");
    statusLabel.textContent = `Đang đọc đoạn ${index + 1}...`;
    statusLabel.style.color = "var(--accent-cyan-light)";
    waveIndicator.classList.remove("hidden");

    const rate = parseFloat(rateSelect.value) || 0.95;
    const utterance = new SpeechSynthesisUtterance(paragraphs[index]);
    utterance.lang = "en-US";
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const enVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("US") || v.name.includes("UK") || v.name.includes("English")));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => {
      stopArticleAudio();
    };
    utterance.onerror = () => {
      stopArticleAudio();
    };

    window.speechSynthesis.speak(utterance);
  }

  function highlightParagraph(index) {
    container.querySelectorAll(".article-paragraph-block").forEach((el, idx) => {
      if (idx === index) {
        el.classList.add("active-reading-paragraph");
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        el.classList.remove("active-reading-paragraph");
      }
    });
  }

  function stopArticleAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isArticleAudioPlaying = false;
    currentParagraphIndex = -1;

    if (btnToggleAudio) {
      btnToggleAudio.classList.remove("btn-secondary");
      btnToggleAudio.classList.add("btn-primary", "glow-cyan");
      playText.textContent = "Nghe Đọc Bài Viết";
      playIcon.setAttribute("data-lucide", "headphones");
    }
    if (btnStopAudio) btnStopAudio.classList.add("hidden");
    if (waveIndicator) waveIndicator.classList.add("hidden");
    if (statusLabel) {
      statusLabel.textContent = "Sẵn sàng phát";
      statusLabel.style.color = "var(--text-secondary)";
    }
    container.querySelectorAll(".article-paragraph-block").forEach(el => {
      el.classList.remove("active-reading-paragraph");
    });
    lucide.createIcons();
  }

  // Toggle Save Article button
  const btnSaveArticle = container.querySelector("#btn-toggle-save-article");
  if (btnSaveArticle) {
    btnSaveArticle.onclick = () => {
      const alreadySaved = storageService.isArticleSaved(currentArticle.id);
      if (alreadySaved) {
        storageService.removeSavedArticle(currentArticle.id);
        renderReadingSection(container);
      } else {
        storageService.saveReadingArticle(currentArticle);
        renderReadingSection(container);
      }
    };
  }

  // Open Saved Articles Modal
  const btnOpenSaved = container.querySelector("#btn-open-saved-articles");
  const modalSaved = container.querySelector("#saved-articles-modal");
  const btnCloseSaved = container.querySelector("#btn-close-saved-articles");
  const listContainer = container.querySelector("#saved-articles-list");

  if (btnOpenSaved && modalSaved) {
    btnOpenSaved.onclick = () => {
      renderSavedArticlesList(listContainer, container, modalSaved);
      modalSaved.classList.remove("hidden");
    };

    if (btnCloseSaved) {
      btnCloseSaved.onclick = () => {
        modalSaved.classList.add("hidden");
      };
    }
  }

  // Daily Reading button (Get another article)
  const btnDaily = container.querySelector("#btn-daily-reading");
  if (btnDaily) {
    btnDaily.onclick = () => {
      stopArticleAudio();
      currentArticle = getRandomReadingArticle();
      chatHistory = [];
      renderReadingSection(container);
    };
  }

  // Word selection lookup
  const articleContent = container.querySelector("#article-content");
  if (articleContent) {
    articleContent.onmouseup = () => {
      const selection = window.getSelection().toString().trim();
      if (selection && selection.length > 1 && selection.length < 30) {
        lookupSelectedWord(selection, container);
      }
    };
  }

  // Chat send button
  const btnSend = container.querySelector("#btn-send-chat");
  const inputEl = container.querySelector("#chat-user-input");

  if (btnSend && inputEl) {
    btnSend.onclick = async () => {
      const userText = inputEl.value.trim();
      if (!userText) return;

      appendChatMessage("user", userText);
      chatHistory.push({ role: "user", text: userText });
      inputEl.value = "";

      const typingId = appendTypingIndicator();

      try {
        const botResponse = await aiService.generateReadingResponse(
          currentArticle.title,
          currentArticle.content,
          userText,
          chatHistory
        );

        removeTypingIndicator(typingId);
        appendChatMessage("bot", botResponse);
        chatHistory.push({ role: "bot", text: botResponse });

        storageService.markSkillCompleted("reading");
      } catch (err) {
        removeTypingIndicator(typingId);
        appendChatMessage("bot", "I'm sorry, I ran into an error processing your message. Could you try rephrasing?");
      }
    };
  }

  // Global helper for quick vocab save
  window.saveQuickVocab = (word, pos, meaning, phonetic) => {
    const success = storageService.saveWord({ word, pos, meaning, phonetic });
    if (success) {
      alert(`✅ Đã lưu từ "${word}" vào Sổ Tay Từ Vựng!`);
    } else {
      alert(`ℹ️ Từ "${word}" đã có trong sổ từ vựng của bạn.`);
    }
  };
}

function stopArticleAudio() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isArticleAudioPlaying = false;
  currentParagraphIndex = -1;
}

function renderSavedArticlesList(listContainer, mainContainer, modal) {
  const savedArticles = storageService.getSavedArticles();

  if (savedArticles.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 2rem;">
        <i data-lucide="bookmark" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
        <p class="text-muted">Bạn chưa lưu bài đọc nào. Hãy bấm nút <strong>"Lưu Bài Học Này"</strong> để lưu lại các bài đọc hay nhé!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  listContainer.innerHTML = savedArticles.map(art => `
    <div class="saved-article-item glass-card" style="padding: 1rem 1.25rem; border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
      <div style="flex: 1; min-width: 220px;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <span class="badge badge-purple" style="font-size: 0.72rem;">${art.category}</span>
          <span class="text-muted small">${art.readTime}</span>
        </div>
        <h4 style="font-size: 1.05rem; font-weight: 700; color: #FFF;">${art.title}</h4>
      </div>

      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button class="btn btn-sm btn-primary glow-cyan btn-open-saved-item" data-id="${art.id}">
          <i data-lucide="book-open"></i> Đọc Bài Này
        </button>
        <button class="btn btn-sm btn-ghost btn-delete-saved-item text-muted" data-id="${art.id}" title="Xóa khỏi danh sách lưu">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
  `).join("");

  lucide.createIcons();

  // Open item
  listContainer.querySelectorAll(".btn-open-saved-item").forEach(btn => {
    btn.onclick = () => {
      const artId = btn.dataset.id;
      const found = savedArticles.find(a => a.id === artId);
      if (found) {
        currentArticle = found;
        chatHistory = [];
        modal.classList.add("hidden");
        renderReadingSection(mainContainer);
      }
    };
  });

  // Delete item
  listContainer.querySelectorAll(".btn-delete-saved-item").forEach(btn => {
    btn.onclick = () => {
      const artId = btn.dataset.id;
      storageService.removeSavedArticle(artId);
      renderSavedArticlesList(listContainer, mainContainer, modal);
      const countEl = mainContainer.querySelector("#btn-open-saved-articles span");
      if (countEl) countEl.textContent = `Bài Học Đã Lưu (${storageService.getSavedArticles().length})`;
    };
  });
}

function lookupSelectedWord(word, container) {
  const dictModal = container.querySelector("#dictionary-modal");
  const dictWord = container.querySelector("#dict-word");
  const dictBody = container.querySelector("#dict-body");

  const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
  if (!cleanWord) return;

  dictWord.textContent = cleanWord;
  dictBody.innerHTML = `<div class="dict-loading"><span class="spinner-sm"></span> Đang tra từ điển...</div>`;
  dictModal.classList.remove("hidden");
  lucide.createIcons();

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        const phonetic = entry.phonetic || entry.phonetics?.[0]?.text || "";
        const meanings = entry.meanings || [];
        const firstDef = meanings[0]?.definitions?.[0]?.definition || "Definition not found.";
        const partOfSpeech = meanings[0]?.partOfSpeech || "noun";

        dictBody.innerHTML = `
          <div class="dict-phonetic">${phonetic} <i data-lucide="volume-2" class="icon-inline" onclick="window.speakSentence('${cleanWord}')"></i></div>
          <div class="dict-pos">Loại từ: <strong>${partOfSpeech}</strong></div>
          <div class="dict-def">Nghĩa tiếng Anh: ${firstDef}</div>
          <button id="btn-save-dict-word" class="btn btn-sm btn-primary full-width mt-sm">
            <i data-lucide="bookmark-plus"></i> Lưu Từ Này
          </button>
        `;

        const btnSaveWord = dictBody.querySelector("#btn-save-dict-word");
        if (btnSaveWord) {
          btnSaveWord.onclick = () => {
            window.saveQuickVocab(cleanWord, partOfSpeech, firstDef, phonetic);
            dictModal.classList.add("hidden");
          };
        }
      } else {
        dictBody.innerHTML = `
          <p class="text-muted">Không tìm thấy định nghĩa tự động cho từ "${cleanWord}".</p>
          <button id="btn-save-custom-word" class="btn btn-sm btn-outline full-width mt-sm">Lưu Từ Này Vào Sổ</button>
        `;
        const btnSaveCustom = dictBody.querySelector("#btn-save-custom-word");
        if (btnSaveCustom) {
          btnSaveCustom.onclick = () => {
            window.saveQuickVocab(cleanWord, "word", "Từ vựng mới tra", "");
            dictModal.classList.add("hidden");
          };
        }
      }
      lucide.createIcons();
    })
    .catch(() => {
      dictBody.innerHTML = `<p class="text-muted">Tra từ ngoại tuyến: "${cleanWord}".</p>`;
    });

  const btnClose = dictModal.querySelector("#btn-close-dict");
  if (btnClose) {
    btnClose.onclick = () => {
      dictModal.classList.add("hidden");
    };
  }
}

function appendChatMessage(role, text) {
  const container = document.getElementById("chat-messages-container");
  if (!container) return;
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${role === 'user' ? 'user-message' : 'bot-message'} fade-in`;

  msgDiv.innerHTML = `
    <div class="avatar"><i data-lucide="${role === 'user' ? 'user' : 'bot'}"></i></div>
    <div class="message-bubble">
      <p>${text.replace(/\n/g, '<br>')}</p>
    </div>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

function appendTypingIndicator() {
  const container = document.getElementById("chat-messages-container");
  if (!container) return "";
  const typingDiv = document.createElement("div");
  const id = "typing_" + Date.now();
  typingDiv.id = id;
  typingDiv.className = "chat-message bot-message fade-in";
  typingDiv.innerHTML = `
    <div class="avatar"><i data-lucide="bot"></i></div>
    <div class="message-bubble typing-dots">
      <span></span><span></span><span></span>
    </div>
  `;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}
