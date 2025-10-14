import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create Supabase client if we have valid environment variables
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false, // We're using our own auth system
        autoRefreshToken: false,
      },
      db: {
        schema: 'public'
      }
    }
  );
} else {
  console.error('Supabase environment variables not configured');
}

export { supabase };

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  return {
    error: true,
    message: error.message || 'An error occurred while communicating with the database'
  };
};