import { z } from 'zod';

// Browser-safe detection
const isBrowser = typeof window !== 'undefined' || typeof self !== 'undefined';

// Load .env only in Node environments
if (!isBrowser) {
  try {
    // Import using dynamic import to avoid issues in some environments
    const dotenv = require('dotenv');
    const path = require('path');
    const rootEnv = path.resolve(process.cwd(), '../../.env');
    const localEnv = path.resolve(process.cwd(), '.env');
    
    dotenv.config({ path: rootEnv });
    dotenv.config({ path: localEnv });
  } catch (e) {
    // Fallback if require fails
  }
}

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
  
  // Vite-exposed variants (for browser)
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).optional(),
  VITE_GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
  VITE_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  
  // External APIs (AI)
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  
  // Cache (Upstash Redis)
  UPSTASH_REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_TOKEN: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Service Ports
  GATEWAY_PORT: z.coerce.number().default(3001),
  AI_SERVICE_PORT: z.coerce.number().default(3002),
  IMAGE_SERVICE_PORT: z.coerce.number().default(3003),
  USER_SERVICE_PORT: z.coerce.number().default(3004),
  READING_SERVICE_PORT: z.coerce.number().default(3005),
  REPORT_SERVICE_PORT: z.coerce.number().default(3006),
  AD_SERVICE_PORT: z.coerce.number().default(3007),
  KEEP_ALIVE_PORT: z.coerce.number().default(3008),

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
export const validateEnv = (config?: Record<string, unknown>): Env => {
  // Determine the source of environment variables
  const source = config || 
    (isBrowser ? (import.meta as any).env : (typeof (globalThis as any).process !== 'undefined' ? (globalThis as any).process.env : {}));

  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    if (isBrowser) {
      // In browser, we just warn to avoid crashing the startup
      console.warn('⚠️ Invalid environment variables detected in browser:', parsed.error.format());
      return (parsed as any).data || envSchema.parse({}); 
    }
    
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsed.error.format(), null, 4));
    
    const proc = (globalThis as any).process;
    if (proc && typeof proc.exit === 'function') {
      proc.exit(1);
    }
    throw new Error('Environment validation failed');
  }

  const data = (parsed as any).data || envSchema.parse({});
  
  // Normalization logic for browser environments (map VITE_ back to regular)
  if (isBrowser) {
    data.SUPABASE_URL = data.SUPABASE_URL || (data as any).VITE_SUPABASE_URL;
    data.SUPABASE_ANON_KEY = data.SUPABASE_ANON_KEY || (data as any).VITE_SUPABASE_ANON_KEY;
    data.NODE_ENV = data.NODE_ENV || (data as any).VITE_APP_ENV;
    data.CLOUDINARY_CLOUD_NAME = data.CLOUDINARY_CLOUD_NAME || (data as any).VITE_CLOUDINARY_CLOUD_NAME;
  }

  return data;
};

// Export singleton to avoid repetitive validation
export const env = validateEnv();
