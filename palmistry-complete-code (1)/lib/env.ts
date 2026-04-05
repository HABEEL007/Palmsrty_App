/**
 * @file env.ts
 * @description Environment variable validation — app crashes on missing config
 */

import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL:      z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_OPENAI_API_KEY:    z.string().min(1).optional(),
  VITE_APP_ENV:           z.enum(['development', 'staging', 'production']).default('development'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('❌ Missing environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration. Check your .env file.');
}

export const env = parsed.data;
