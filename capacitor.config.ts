import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.homesetupsolutions.app',
  appName: 'Home Setup Solutions',
  webDir: 'dist',
  server: {
    url: 'https://5f9c6787-0b97-4997-b653-5dc7ab99d878.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
