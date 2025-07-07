const supabase = require('../services/supabaseService');
const { getQlooRecommendations } = require('../services/qlooService');
const { buildRecommendationPrompt } = require('../utils/promptBuilder');
const { generateEmbedding } = require('../services/openaiService');
const { OpenAIApi, Configuration } = require('openai');

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

/**
 * POST /api/recommend
 * Input: { embedding_id: "abc123" }
 * Logic: Fetch taste input and similar, call Qloo, build prompt, call GPT, return recommendations
 */
exports.recommend = async (req, res) => {
  try {
    const { embedding_id } = req.body;
    if (!embedding_id) return res.status(400).json({ error: 'embedding_id is required' });

    // Fetch original taste input
    const { data: tasteData, error: tasteError } = await supabase
      .from('user_tastes')
      .select('input')
      .eq('id', embedding_id)
      .single();
    if (tasteError || !tasteData) throw tasteError || new Error('Taste input not found');
    const userInput = tasteData.input;

    // Fetch top 3 similar tastes
    const { data: similarData, error: similarError } = await supabase.rpc('match_user_tastes', {
      query_embedding: (await supabase
        .from('user_tastes')
        .select('embedding')
        .eq('id', embedding_id)
        .single()).data.embedding,
      match_count: 3,
      exclude_id: embedding_id,
    });
    if (similarError) throw similarError;
    const similarEntries = (similarData || []).map(e => e.input);

    // Call Qloo API
    const qlooResults = await getQlooRecommendations([userInput, ...similarEntries]);

    // Build GPT prompt
    const prompt = buildRecommendationPrompt(userInput, similarEntries, qlooResults);

    // Call OpenAI GPT-4 for explanation/formatting
    const gptResponse = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: prompt },
      ],
      max_tokens: 600,
    });
    const gptText = gptResponse.data.choices[0].message.content;

    // Return both raw and formatted results
    return res.json({
      results: qlooResults,
      explanation: gptText,
    });
  } catch (err) {
    console.error('Error in recommend:', err);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};
