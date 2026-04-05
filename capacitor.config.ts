import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.alecrae.voice',
  appName: 'AlecRae Voice',
  webDir: 'out',
  server: {
    url: 'https://alecrae.app',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      backgroundColor: '#111920',
      launchAutoHide: true,
      autoHide: true,
      autoHideDelay: 2000,
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#111920',
    },
    Keyboard: {
      resize: 'body',
      scroll: true,
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'AlecRae Voice',
  },
  android: {
    backgroundColor: '#111920',
    allowMixedContent: false,
  },
};

export default config;
