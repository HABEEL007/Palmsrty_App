import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Force load .env from the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') }); // Fallback for package dirs

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

export type Env = z.infer<typeof envSchema>;

/**
 * Validated Environment Variables
 */
export const validateEnv = (config: Record<string, unknown> = process.env): Env => {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsed.error.format(), null, 4));
    process.exit(1);
  }

  return parsed.data;
};

// Export singleton to avoid repetitive validation
export const env = validateEnv();
