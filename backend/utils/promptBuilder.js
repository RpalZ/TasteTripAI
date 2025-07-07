/**
 * Build a system prompt for GPT-4 to explain and format recommendations
 * @param {string} userInput - The original user taste input
 * @param {string[]} similarEntries - Array of similar taste strings
 * @param {Object[]} qlooResults - Raw Qloo recommendations
 * @returns {string} - The prompt for GPT
 */
function buildRecommendationPrompt(userInput, similarEntries, qlooResults) {
  return `The user has a taste for: ${userInput}.
They previously liked: ${similarEntries.join(', ')}.
Qloo recommends: ${qlooResults.map(r => r.title).join(', ')}.

Recommend cultural experiences across food, travel, music, or fashion that align with these preferences. For each, provide a title, type, description, location, and (if available) lat/lng.`;
}

module.exports = { buildRecommendationPrompt };
