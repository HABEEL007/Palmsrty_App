/**
 * @file env.ts
 * @description Zod-based environment variable validation for all PALMSTRY services.
 */

import { z } from 'zod';

/**
 * Common Environment Schema
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  
  // Auth
  JWT_SECRET: z.string().min(32).default('a_very_secret_placeholder_for_dev_only'),
  
  // Supabase ($0 DB & Auth)
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // External APIs (AI)
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  
  // Cache (Upstash Redis)
  UPSTASH_REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),
  
  // Image Storage (Cloudinary)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_URL: z.string().url().optional(),
});

/**
 * Validated Environment Variables
 */
export const validateEnv = (processEnv: NodeJS.ProcessEnv = process.env) => {
  const parsed = envSchema.safeParse(processEnv);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsed.error.format(), null, 4));
    process.exit(1);
  }

  return parsed.data;
};
