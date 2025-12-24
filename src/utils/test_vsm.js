import { getRecommendations } from './recommendationEngine.js';

const mockProfile = {
    interests: { numbers: true, logic: true, building: false },
    confidence: { math: 9, coding: 8, communication: 4 },
    workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk' }
};

console.log("Testing VSM Recommendation Engine...");
console.log("Mock Profile:", JSON.stringify(mockProfile));

const recs = getRecommendations(mockProfile);
console.log("\nRecommendations:");
recs.forEach((r, i) => {
    console.log(`${i + 1}. ${r.career} (Similarity: ${r.prob})`);
});
