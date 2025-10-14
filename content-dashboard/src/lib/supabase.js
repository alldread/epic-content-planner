import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Loaded' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Loaded' : 'Missing');

// Create Supabase client - it will work when env vars are present (like on Vercel)
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found - database operations will fail');
  console.log('URL:', supabaseUrl ? 'Present' : 'MISSING');
  console.log('Key:', supabaseAnonKey ? 'Present' : 'MISSING');
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  return {
    error: true,
    message: error.message || 'An error occurred while communicating with the database'
  };
};