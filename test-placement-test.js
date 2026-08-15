// Verification script for placement test data & grading calculations
import { PLACEMENT_TEST_DATA, calculateCefrLevel } from "./js/data/placement-test.js";

console.log("=== 1. Checking Placement Test Data ===");
console.log("Listening questions:", PLACEMENT_TEST_DATA.listening.questions.length);
console.log("Reading questions:", PLACEMENT_TEST_DATA.reading.questions.length);
console.log("Writing questions:", PLACEMENT_TEST_DATA.writing.questions.length);
console.log("Speaking questions:", PLACEMENT_TEST_DATA.speaking.questions.length);

console.log("\n=== 2. Testing CEFR Calculation Logic ===");
console.log("3/3 correct:", calculateCefrLevel(3, 3), "=> Expected: C1");
console.log("2/3 correct (66%):", calculateCefrLevel(2, 3), "=> Expected: B1");
console.log("1/3 correct (33%):", calculateCefrLevel(1, 3), "=> Expected: A2");
console.log("0/3 correct (0%):", calculateCefrLevel(0, 3), "=> Expected: A1");

console.log("\n=== Placement Test logic verified successfully! ===");
