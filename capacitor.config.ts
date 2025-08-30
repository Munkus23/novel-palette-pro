import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6f62f77cbe6d412aae6411cab199336c',
  appName: 'MangaEdit Pro',
  webDir: 'dist',
  server: {
    url: 'https://6f62f77c-be6d-412a-ae64-11cab199336c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;