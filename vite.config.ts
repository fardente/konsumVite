import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'));

// Short commit hash of the build, with "-dirty" if there were uncommitted
// changes, so a deployed build can always be traced back to its source.
function gitRevision(): string {
  try {
    const hash = execSync('git rev-parse --short HEAD').toString().trim();
    const dirty = execSync('git status --porcelain --untracked-files=no')
      .toString()
      .trim();
    return dirty ? `${hash}-dirty` : hash;
  } catch {
    return 'unknown';
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __GIT_REVISION__: JSON.stringify(gitRevision()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'test-setup.js',
  },
  build: {
    rollupOptions: {
      // Avoid pulling in polyfill shims for node core libs Firebase sometimes references
      external: ['crypto', 'stream', 'buffer'],
      output: {
        manualChunks: {
          'vendor-react': [
            'react',
            'react-dom',
            'react-dom/client',
            'react-router-dom',
          ],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-firebase': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
          ],
          'vendor-icons': ['react-icons/io5'], // or '@iconify/react' if you switch
        },
      },
    },
    minify: 'esbuild',
    target: 'esnext',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      mode: 'production',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'safari-pinned-tab.svg',
      ],
      manifest: {
        name: 'Konsumhelferlein',
        short_name: 'Konsum',
        description: 'Kauf mehr',
        theme_color: '#eff5fb',
        background_color: '#eff5fb',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      template: 'sunburst',
      // Keep the report out of dist/, otherwise it gets deployed and
      // precached by the service worker (~220 kB on first visit).
      filename: 'stats.html',
      open: false,
    }),
  ],
});
