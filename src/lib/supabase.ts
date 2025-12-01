/**
 * Supabase Client Configuration
 * Replaces the PHP backend API with Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  throw new Error('Missing Supabase configuration. Check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Since we're not using authentication yet
  },
});

// Test connection (only in development)
if (process.env.NODE_ENV === 'development') {
  supabase
    .from('partners')
    .select('count')
    .then(({ error }) => {
      if (error) {
        console.error('❌ Supabase connection error:', error.message);
        console.log('💡 Make sure:');
        console.log('1. Tables are created in Supabase');
        console.log('2. Row Level Security policies allow public read');
        console.log('3. Your API key is correct');
      } else {
        console.log('✅ Supabase connected successfully!');
      }
    });
}

