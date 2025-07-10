const supabase = require('../services/supabaseService');
const { generateEmbedding } = require('../services/openaiService');

/**
 * Store a user's taste input as a vector + raw data
 * POST /api/taste
 */
exports.createTaste = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: 'Input is required' });

    // Generate embedding
    const embedding = await generateEmbedding(input);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('user_tastes')
      .insert([
        {
          input,
          embedding,
          
        },
      ])
      .select('id');

    if (error) throw error;
    const embedding_id = data[0].id;
    return res.json({ embedding_id });
  } catch (err) {
    console.error('Error in createTaste:', err);
    return res.status(500).json({ error: 'Failed to store taste input' });
  }
};

/**
 * Find similar past taste entries via vector similarity
 * GET /api/taste/similar?id=abc123
 */
exports.getSimilarTastes = async (req, res) => {
  try {
    const { id } = req.query;
    const TOP_N = 3;
    if (!id) return res.status(400).json({ error: 'id is required' });

    // Fetch the target embedding by ID
    const { data: targetData, error: targetError } = await supabase
      .from('user_tastes')
      .select('embedding')
      .eq('id', id)
      .single();
    if (targetError || !targetData) throw targetError || new Error('Embedding not found');
    const targetEmbedding = targetData.embedding;

    // Run pgvector similarity query (cosine distance)
    const { data: similarData, error: similarError } = await supabase.rpc('match_user_tastes', {
      query_embedding: targetEmbedding,
      match_count: TOP_N,
      exclude_id: id,
    });
    if (similarError) throw similarError;

    return res.json(similarData);
  } catch (err) {
    console.error('Error in getSimilarTastes:', err);
    return res.status(500).json({ error: 'Failed to find similar tastes' });
  }
};
