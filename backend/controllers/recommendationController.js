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
    const locationArray = extraction.location_array || null;
    
    // Log location information
    console.log('📍 Extracted location:', location);
    console.log('🌍 Extracted locationArray:', locationArray);
    console.log('📋 Entity type:', entityType);
    console.log('🏷️  Entity names:', entityNames);
    
    // Validate location data
    if (locationArray && locationArray.length > 0) {
      console.log('✅ Location array validation:');
      locationArray.forEach((loc, index) => {
        console.log(`  ${index + 1}. "${loc}" (length: ${loc.length})`);
      });
    }

    // Resolve entity names to Qloo entity IDs
    const entityResolution = await resolveEntityIds(entityNames, entityType, location);
    const entityIds = entityResolution.entityIds;
    const entityDetails = entityResolution.entityDetails;
    console.log('entityIds', entityIds);
    console.log('entityDetails count:', entityDetails.length);
    if (!entityIds.length) {
      return res.status(400).json({ error: 'No valid Qloo entity IDs found for input.' });
    }

    // Build Qloo API params
    const params = {
      'filter.type': `urn:entity:${entityType}`,
      'signal.interests.entities': entityIds.join(','),
      'take': 10 // Increased limit to get more results
    };
    

    // Handle location parameters - support multiple locations
    if (locationArray && locationArray.length > 0) {
      // Use location array for multiple countries (from continent expansion)
      params['filter.location.query'] = locationArray;
      console.log('🌍 Added location array to Qloo params (filter):', locationArray);
      console.log('📊 Location array length:', locationArray.length);
    } else if (location) {
      
        // Location-based entities: use filter.location.query for geographic filtering
        params['filter.location.query'] = location;
        console.log('📍 Added single location to Qloo params (filter):', location);
   
    } else {
      console.log('🚫 No location data available');
    }
    // Call Qloo API with error handling for location queries
    let qlooResults = [];
    let combinedResults = [];
    let hasQlooResults = false;
    let hasEntityDetails = false;
    
    try {
      console.log('🚀 Making Qloo API request with params:', JSON.stringify(params, null, 2));
      
      qlooResults = await getQlooRecommendations(params);
      
      // Log successful Qloo API response
      console.log('✅ Qloo API Response Status: Success');
      console.log('📊 Qloo API Results Count:', qlooResults?.length || 0);
      
      if (qlooResults && qlooResults.length > 0) {
        hasQlooResults = true;
        console.log('🏆 Top Qloo Results:');
        qlooResults.slice(0, 3).forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.name || result.entity_id} (${result.subtype || 'unknown type'})`);
        });
        
        if (qlooResults.length > 3) {
          console.log(`  ... and ${qlooResults.length - 3} more results`);
        }
      } else {
        console.log('⚠️  No results returned from Qloo API');
      }
      
    } catch (error) {
      console.error('❌ Qloo API Error:', error.message);
      console.error('🔍 Qloo API Error Status:', error.response?.status);
      console.error('📄 Qloo API Error Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('📋 Qloo API Request Params:', JSON.stringify(params, null, 2));
      
      // Check if it's a 400 error due to location not found
      if (error.response?.status === 400) {
        console.error('⚠️  Location not found error - check if locations are valid:');
        if (locationArray) {
          console.error('Location Array:', locationArray);
        }
        if (location) {
          console.error('Single Location:', location);
        }
        console.error('Entity Type:', entityType);
        console.error('Entity Names:', entityNames);
      }
      
      console.log('❌ Qloo API Error, but continuing with entity details...');
      // Don't throw error, continue with entity details
    }
    
    // Always add entity details to combined results
    console.log('🔄 Adding entity details to combined results...');
    const entityResults = entityDetails.map(detail => ({
      entity_id: detail.entity_id,
      name: detail.name,
      subtype: detail.subtype,
      location: detail.location,
      properties: detail.properties,
      source: 'entity_search' // Mark as from entity search
    }));
    
    if (entityResults.length > 0) {
      hasEntityDetails = true;
      console.log('✅ Entity details added:', entityResults.length, 'entities');
      entityResults.slice(0, 3).forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.name} (${result.subtype}) - Location: ${result.location}`);
      });
    }
    
    // Combine results, prioritizing Qloo recommendations but including all unique entities
    console.log('🔄 Combining Qloo recommendations and entity details...');
    
    // Start with Qloo results
    combinedResults = [...qlooResults];
    
    // Add entity details that aren't already in Qloo results
    const qlooEntityIds = new Set(qlooResults.map(result => result.entity_id));
    const uniqueEntityResults = entityResults.filter(entity => !qlooEntityIds.has(entity.entity_id));
    
    if (uniqueEntityResults.length > 0) {
      console.log('✅ Added unique entity details:', uniqueEntityResults.length, 'entities');
      combinedResults.push(...uniqueEntityResults);
    }
    
    console.log('📊 Final combined results:', {
      totalResults: combinedResults.length,
      qlooResults: qlooResults.length,
      entityDetails: entityResults.length,
      uniqueEntityDetails: uniqueEntityResults.length,
      hasQlooResults,
      hasEntityDetails
    });

    // Return all results instead of limiting to 8
    const allResults = combinedResults

    // Build GPT prompt
    const prompt = buildRecommendationPrompt(userInput, similarEntries, allResults, entityType);

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
      results: allResults,
      explanation: explanationArr,
      resultStats: {
        totalResults: combinedResults.length,
        qlooResults: qlooResults.length,
        entityDetails: entityDetails.length,
        hasQlooResults,
        hasEntityDetails
      },
      combinedMessage: hasQlooResults && hasEntityDetails 
        ? 'Combined Qloo recommendations with additional search results for comprehensive coverage'
        : hasQlooResults 
        ? 'Using Qloo recommendations'
        : 'Using search results as Qloo recommendations returned no results'
    });
  } catch (err) {
    console.error('Error in recommend:', err);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};
