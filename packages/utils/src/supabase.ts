/**
 * @file supabase.ts
 * @description Universal Supabase client for PALMSTRY AI.
 * Handles both Vite (import.meta.env) and Node (process.env) contexts.
 */

import { createClient } from '@supabase/supabase-js';

// Environment-agnostic variable retrieval
const getEnv = (key: string): string | undefined => {
  // @ts-ignore - Handle Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[`VITE_${key}`];
  }
  // Handle Node.js
  return process.env[key];
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing. Client initialization will fail.');
}

/**
 * Universal Supabase Client
 */
export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
