const { OpenAIApi, Configuration } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Generate an embedding for the given text using OpenAI's API.
 * @param {string} text
 * @returns {Promise<number[]>} Embedding vector
 */
async function generateEmbedding(text) {
  const response = await openai.createEmbedding({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data.data[0].embedding;
}

module.exports = { generateEmbedding };
