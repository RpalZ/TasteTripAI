/**
 * Build a system prompt for GPT-4 to explain and format recommendations
 * @param {string} userInput - The original user taste input
 * @param {string[]} similarEntries - Array of similar taste strings
 * @param {Object[]} qlooResults - Raw Qloo recommendations
 * @param {string} entityType - The type of cultural entity (e.g., 'food', 'travel', 'music', 'fashion')
 * @returns {string} - The prompt for GPT
 */
function buildRecommendationPrompt(userInput, similarEntries, qlooResults, entityType) {
  // Prepare context strings
  const similarStr = similarEntries && similarEntries.length
    ? `They previously liked: ${similarEntries.join(', ')}.`
    : '';
  const qlooStr = qlooResults && qlooResults.length
    ? `Qloo recommends:\n${qlooResults.map(r => `- name: ${r.name}, country:${r.properties?.geocode?.country}, geohash: ${r.location?.geohash}, lat: ${r.location?.lat}, lng: ${r.location?.lon}, address: ${r.properties?.address}`).join('\n')}`
    : '';
  const entityTypeStr = entityType ? `The relevant cultural domain is: ${entityType}.` : '';

  // Compose the prompt
  // console.log('qlooStr', qlooStr);
  return `The user has a taste for: ${userInput}.
${similarStr}
${qlooStr}
${entityTypeStr}

Based on this, write a personalized, engaging 100 word description for each recommendation, explaining why it is a great fit for the user. Output your response as a JSON array of natural language strings, one for each recommendation, in the same order as the Qloo list e.g { "recommendations": ["recommendation1", "recommendation2", "recommendation3"] }.`;
}

module.exports = { buildRecommendationPrompt };
