/**
 * @file supabase.ts
 * @description Universal Supabase client for PALMSTRY AI.
 * Handles both Vite (import.meta.env) and Node (process.env) contexts.
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '@palmistry/config/env';

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_ANON_KEY;

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
