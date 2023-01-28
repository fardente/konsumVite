import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'test-setup.js',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // devOptions: {
      //     enabled: true,
      // },
    }),
  ],
});
