/**
 * @module env
 * @description Validates all required VITE_ environment variables at startup.
 * If any required variable is missing, throws an error immediately to prevent
 * silent runtime failures. Follows the 12-Factor App config principle.
 */

import { z } from 'zod';

/** Zod schema defining all required and optional frontend env vars */
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_OPENAI_API_KEY: z.string().startsWith('sk-').optional(),
  VITE_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  VITE_META_APP_ID: z.string().min(1).optional(),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production'])
    .default('development'),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const fieldErrors = parsed.error.flatten().fieldErrors;
  throw new Error(
    `❌ Missing or invalid environment variables:\n${JSON.stringify(fieldErrors, null, 2)}\n\nPlease check your .env file.`,
  );
}

/**
 * Validated and typed environment configuration.
 * Import this instead of using import.meta.env directly.
 */
export const env = parsed.data;
