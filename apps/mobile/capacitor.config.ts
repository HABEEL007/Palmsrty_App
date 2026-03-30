import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.palmistryai.app',
  appName: 'Palmistry AI',
  webDir: '../web/dist',
  
  server: {
    // URL will be provided via environment variables in production
    url: 'https://palmistry-web.vercel.app',
    cleartext: false
  },
  
  android: {
    backgroundColor: '#0B0F1A',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0B0F1A',
      showSpinner: false
    },
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
