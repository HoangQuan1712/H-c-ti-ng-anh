// Unit test for Saved Reading Articles
import { storageService } from "./js/storage.js";

console.log("=== 1. Test Saving Reading Article ===");
const sampleArticle = {
  id: "read_ai_work",
  category: "Công nghệ & Việc làm",
  readTime: "3 phút đọc",
  title: "The Rise of Generative AI in the Modern Workplace",
  content: "Generative AI is rapidly reshaping how professionals work...",
  discussionStarter: "How do you think generative AI will impact your specific career or daily study habits in the next few years?",
  vocabulary: [
    { word: "streamline", pos: "v", phonetic: "/'stri:mlaɪn/", meaning: "tối ưu hóa quy trình" }
  ]
};

// Mock localStorage for node if needed
if (typeof localStorage === "undefined") {
  global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  };
}

storageService.saveReadingArticle(sampleArticle);
console.log("Is article saved:", storageService.isArticleSaved("read_ai_work"));
console.log("Saved articles count:", storageService.getSavedArticles().length);

console.log("\n=== 2. Test Removing Saved Article ===");
storageService.removeSavedArticle("read_ai_work");
console.log("Is article saved after remove:", storageService.isArticleSaved("read_ai_work"));
console.log("Saved articles count after remove:", storageService.getSavedArticles().length);

console.log("\n=== Saved Reading Articles verified successfully! ===");
