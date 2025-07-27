const supabase = require('../services/supabaseService');
const { getQlooRecommendations, resolveEntityIds } = require('../services/qlooService');
const { buildRecommendationPrompt } = require('../utils/promptBuilder');
const { generateEmbedding, extractEntitiesWithGPT } = require('../services/openaiService');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * POST /api/recommend
 * Input: { embedding_id: "abc123" }
 * Logic: Fetch taste input and similar, call Qloo, build prompt, call GPT, return recommendations
 */
exports.recommend = async (req, res) => {
  try {
    const { embedding_id } = req.body;
    if (!embedding_id) return res.status(400).json({ error: 'embedding_id is required' });

    // Get user ID from JWT
    const userId = req.user.sub;

    // Fetch original taste input
    const { data: tasteData, error: tasteError } = await supabase
      .from('user_tastes')
      .select('input')
      .eq('id', embedding_id)
      .eq('user_id', userId) // Ensure user owns this taste entry
      .single();
    if (tasteError || !tasteData) throw tasteError || new Error('Taste input not found');
    const userInput = tasteData.input;

    // Fetch top 6 similar tastes from the same user
    const { data: similarData, error: similarError } = await supabase.rpc('match_user_tastes', {
      query_embedding: (await supabase
        .from('user_tastes')
        .select('embedding')
        .eq('id', embedding_id)
        .eq('user_id', userId) // Ensure user owns this taste entry
        .single()).data.embedding,
      match_count: 6,
      exclude_id: embedding_id,
      user_id: userId, // Pass user_id to filter by same user
    });
    if (similarError) throw similarError;
    const similarEntries = (similarData || []).map(e => e.input);

    // Use GPT to extract entity type and canonical entity names
    console.log('userInput', userInput);
    console.log('similarEntries', similarEntries);
    const extraction = await extractEntitiesWithGPT(userInput, similarEntries);
    const entityType = extraction.entity_type.toLowerCase().split(' ').join('');
    const entityNames = extraction.entity_names;

    //once auth is completed, add location to the extraction from the user profile
    const location = extraction.location;

    // Resolve entity names to Qloo entity IDs
    console.log('entityType', entityType);
    console.log('entityNames', entityNames); 
    const entityIds = await resolveEntityIds(entityNames, entityType, location);
    console.log('entityIds', entityIds);
    if (!entityIds.length) {
      return res.status(400).json({ error: 'No valid Qloo entity IDs found for input.' });
    }

    // Build Qloo API params
    const params = {
      'filter.type': `urn:entity:${entityType}`,
      'signal.interests.entities': entityIds.join(','),
      'limit': 8 // Limit results to 8 for better performance
    };
    // If the entity type is location-based and a location is present, add as signal.location.query
    if (["destination","place","location"].includes(entityType) && location) {
      params['signal.location.query'] = location;
    }
    const qlooResults = await getQlooRecommendations(params);

    // Limit results to 8 recommendations for better performance
    const limitedResults = qlooResults.slice(0, 8);

    // Build GPT prompt
    const prompt = buildRecommendationPrompt(userInput, similarEntries, limitedResults, entityType);

    // Call OpenAI GPT-4 for explanation/formatting
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt },
      ],
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });
    let gptText = gptResponse.choices[0].message.content;
    let explanationArr;
    try {
      explanationArr = JSON.parse(gptText);
    } catch (e) {
      explanationArr = gptText; // fallback to raw string if parsing fails
    }
    // console.trace(explanationArr);
    // Return both raw and formatted results
    return res.json({
      results: limitedResults,
      explanation: explanationArr,
    });
  } catch (err) {
    console.error('Error in recommend:', err);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};
