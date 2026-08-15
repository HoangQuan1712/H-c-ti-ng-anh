// Vocabulary Notebook Controller
import { storageService } from "./storage.js";

export function renderVocabSection(container) {
  const vocabList = storageService.getVocab();

  container.innerHTML = `
    <div class="section-header fade-in">
      <div>
        <h2 class="section-title"><i data-lucide="book-marked"></i> Sổ Tay Từ Vựng (Vocab Notebook)</h2>
        <p class="section-subtitle">Tất cả các từ vựng bạn đã tra và lưu trong quá trình đọc & học daily.</p>
      </div>

      <button id="btn-add-custom-vocab" class="btn btn-primary glow-cyan">
        <i data-lucide="plus"></i> Thêm Từ Vựng Mới
      </button>
    </div>

    <!-- Search & Filter Bar -->
    <div class="card glass-card fade-in mb-lg">
      <div class="search-box">
        <i data-lucide="search" class="search-icon"></i>
        <input type="text" id="search-vocab-input" class="search-input" placeholder="Tìm kiếm từ vựng hoặc nghĩa tiếng Việt...">
      </div>
    </div>

    <!-- Vocab Cards Grid -->
    <div id="vocab-cards-grid" class="vocab-grid-main fade-in">
      ${renderVocabCardsHtml(vocabList)}
    </div>

    <!-- Add Custom Vocab Modal -->
    <div id="modal-add-vocab" class="modal-backdrop hidden">
      <div class="modal-content glass-card modal-md fade-in">
        <button id="btn-close-vocab-modal" class="modal-close"><i data-lucide="x"></i></button>
        <h3 class="modal-title"><i data-lucide="plus-circle"></i> Thêm Từ Vựng Mới Vào Sổ</h3>
        
        <div class="form-group mt-md">
          <label>Từ tiếng Anh (*)</label>
          <input type="text" id="input-new-word" class="form-control" placeholder="Ví dụ: Resilience">
        </div>

        <div class="form-group">
          <label>Loại từ (Part of Speech)</label>
          <select id="input-new-pos" class="form-control">
            <option value="noun">Noun (Danh từ)</option>
            <option value="verb">Verb (Động từ)</option>
            <option value="adjective">Adjective (Tính từ)</option>
            <option value="adverb">Adverb (Phó từ)</option>
            <option value="phrase">Phrase (Cụm từ)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Phiên âm (Phonetics)</label>
          <input type="text" id="input-new-phonetic" class="form-control" placeholder="Ví dụ: /rɪˈzɪliəns/">
        </div>

        <div class="form-group">
          <label>Nghĩa Tiếng Việt (*)</label>
          <input type="text" id="input-new-meaning" class="form-control" placeholder="Ví dụ: Khả năng phục hồi, sự kiên cường">
        </div>

        <div class="form-group">
          <label>Ví dụ minh họa (Example sentence)</label>
          <textarea id="input-new-example" class="form-control" placeholder="Ví dụ: Her resilience helped her overcome difficult times."></textarea>
        </div>

        <button id="btn-save-new-vocab" class="btn btn-primary glow-cyan full-width mt-md">
          <i data-lucide="save"></i> Lưu Từ Vựng
        </button>
      </div>
    </div>
  `;

  lucide.createIcons();
  attachVocabEvents(container);
}

function renderVocabCardsHtml(list) {
  if (!list || list.length === 0) {
    return `
      <div class="empty-state full-width">
        <i data-lucide="bookmark" class="icon-xl"></i>
        <p>Sổ từ vựng của bạn đang trống. Khi đọc bài đọc hoặc xem ví dụ, nhấp vào từ để lưu lại tại đây!</p>
      </div>
    `;
  }

  return list.map(item => `
    <div class="vocab-card glass-card">
      <div class="vocab-card-header">
        <div>
          <h4 class="vocab-title">${item.word}</h4>
          <span class="badge badge-purple">${item.pos || 'n'}</span>
          ${item.phonetic ? `<span class="phonetic">${item.phonetic}</span>` : ''}
        </div>
        <button class="btn-icon-small btn-speak-vocab" onclick="window.speakSentence('${item.word.replace(/'/g, "\\'")}')" title="Nghe âm thanh">
          <i data-lucide="volume-2"></i>
        </button>
      </div>

      <p class="vocab-meaning-main">👉 <strong>${item.meaning}</strong></p>

      ${item.example ? `<p class="vocab-example-text"><em>"${item.example}"</em></p>` : ''}

      <div class="vocab-card-footer">
        <span class="saved-date">Ngày lưu: ${item.savedAt}</span>
        <button class="btn-icon-small btn-delete-vocab" data-id="${item.id}" title="Xóa từ này">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function attachVocabEvents(container) {
  // Search filter
  const searchInput = document.getElementById("search-vocab-input");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    const all = storageService.getVocab();
    const filtered = all.filter(item =>
      item.word.toLowerCase().includes(query) ||
      item.meaning.toLowerCase().includes(query)
    );
    document.getElementById("vocab-cards-grid").innerHTML = renderVocabCardsHtml(filtered);
    lucide.createIcons();
    attachDeleteEvents(container);
  });

  // Add custom vocab modal
  const btnAdd = document.getElementById("btn-add-custom-vocab");
  const modal = document.getElementById("modal-add-vocab");
  const btnClose = document.getElementById("btn-close-vocab-modal");
  const btnSave = document.getElementById("btn-save-new-vocab");

  btnAdd.addEventListener("click", () => modal.classList.remove("hidden"));
  btnClose.addEventListener("click", () => modal.classList.add("hidden"));

  btnSave.addEventListener("click", () => {
    const word = document.getElementById("input-new-word").value.trim();
    const pos = document.getElementById("input-new-pos").value;
    const phonetic = document.getElementById("input-new-phonetic").value.trim();
    const meaning = document.getElementById("input-new-meaning").value.trim();
    const example = document.getElementById("input-new-example").value.trim();

    if (!word || !meaning) {
      alert("Vui lòng nhập Từ tiếng Anh và Nghĩa tiếng Việt.");
      return;
    }

    storageService.saveWord({ word, pos, phonetic, meaning, example });
    modal.classList.add("hidden");
    renderVocabSection(container);
  });

  attachDeleteEvents(container);
}

function attachDeleteEvents(container) {
  document.querySelectorAll(".btn-delete-vocab").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (confirm("Bạn có chắc chắn muốn xóa từ này khỏi sổ từ vựng?")) {
        storageService.deleteWord(id);
        renderVocabSection(container);
      }
    });
  });
}
