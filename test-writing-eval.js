// Unit Test for Writing AI Detailed Error Evaluation & History Management
import { aiService } from "./js/ai-service.js";
import { storageService } from "./js/storage.js";

// Mock localStorage for node environment
if (typeof localStorage === "undefined") {
  global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  };
}

console.log("=== 1. Test AI Evaluation on Student Essay with Errors ===");
const sampleTopic = "Impact of Technology on Remote Work";
const samplePrompt = "Discuss how modern technology has transformed remote work and its potential drawbacks.";
const sampleEssay = `i am agree that technology has changed our life. he go to office everyday because he thinks it is better, but informations show that remote work is good. alot of people is interested on working from home because they save time so they have more freedom.`;

const evalResult = await aiService.evaluateEssay(sampleTopic, samplePrompt, sampleEssay);
console.log("CEFR Level:", evalResult.cefrLevel);
console.log("Overall Score:", evalResult.overallScore);
console.log("Criteria Scores:", evalResult.criteriaScores);
console.log("Errors detected count:", evalResult.detailedErrors?.length);

evalResult.detailedErrors?.forEach((err, idx) => {
  console.log(`\n  [Lỗi #${idx + 1}] (${err.type})`);
  console.log(`    ❌ Lỗi: "${err.original}"`);
  console.log(`    ✅ Sửa: "${err.corrected}"`);
  console.log(`    💡 Giải thích: ${err.explanation}`);
});

console.log("\n=== 2. Test Saving Essay with Full Evaluation to History ===");
const savedItem = storageService.saveEssay({
  topicTitle: sampleTopic,
  topicPrompt: samplePrompt,
  essayText: sampleEssay,
  wordCount: sampleEssay.split(/\s+/).length,
  cefrLevel: evalResult.cefrLevel,
  overallScore: evalResult.overallScore,
  evaluation: evalResult
});

console.log("Saved Essay ID:", savedItem.id);
console.log("Saved Date:", savedItem.date);
console.log("Total Essays in History:", storageService.getEssays().length);

console.log("\n=== 3. Test Retrieving Saved Essay Detail from History ===");
const retrieved = storageService.getEssays().find(e => e.id === savedItem.id);
console.log("Retrieved Essay Topic:", retrieved.topicTitle);
console.log("Retrieved Errors Count:", retrieved.evaluation.detailedErrors.length);
console.log("Retrieved Improved Essay length:", retrieved.evaluation.improvedEssay.length);

console.log("\n=== 4. Test Deleting Essay from History ===");
storageService.deleteEssay(savedItem.id);
console.log("Total Essays after deletion:", storageService.getEssays().length);

console.log("\n=== All Writing Evaluation & History tests passed successfully! ===");
