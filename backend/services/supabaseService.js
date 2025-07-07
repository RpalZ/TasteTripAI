const { createClient } = require('@supabase/supabase-js');

// Ensure pgvector extension is enabled in your Supabase Postgres instance.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

module.exports = supabase;
