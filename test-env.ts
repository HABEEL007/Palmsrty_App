import { env } from './packages/config/src/env.ts';
console.log('ENV Test:', {
  SUPABASE_URL: env.SUPABASE_URL,
  NODE_ENV: env.NODE_ENV,
});
