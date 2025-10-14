import { createClient } from '@supabase/supabase-js';

// Hardcoding because environment variables aren't loading
const supabaseUrl = 'https://nqbetmhexfyvmrhorpgt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmV0bWhleGZ5dm1yaG9ycGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNzc1MTEsImV4cCI6MjA3NTk1MzUxMX0.hhaJbbBQPqM30kUcin4qQ546CRFw9_9y7_IdQ5rbcog';

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