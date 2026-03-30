/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Keep-Alive Service - prevents Render.com free tier hibernation.
 */

const SERVICES = [
  'https://palmistry-gateway.onrender.com/health',
  'https://palmistry-ai-service.onrender.com/health',
  'https://palmistry-image-service.onrender.com/health',
];

// Ping every 10 minutes (600,000 ms)
const startHeartbeat = () => {
  console.log('💓 Starting keep-alive heartbeat for Render services...');
  
  setInterval(async () => {
    for (const url of SERVICES) {
      try {
        const start = Date.now();
        const response = await fetch(url);
        const duration = Date.now() - start;
        
        if (response.ok) {
          console.log(`✅ [${new Date().toISOString()}] Pinged: ${url} (${duration}ms)`);
        } else {
          console.warn(`⚠️ [${new Date().toISOString()}] Ping Failed: ${url} | Status: ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ [${new Date().toISOString()}] Ping Error: ${url} | ${error}`);
      }
    }
  }, 10 * 60 * 1000);
};

startHeartbeat();
