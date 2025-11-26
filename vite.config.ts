// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import terser from '@rollup/plugin-terser';

const ANALYZE = process.env.ANALYZE === 'true';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      tsConfigPaths(),

      // Optional: bundle visualizer when ANALYZE=true
      ANALYZE &&
        visualizer({
          filename: './dist/bundle-report.html',
          title: 'Bundle Analyzer',
          sourcemap: true,
          template: 'treemap',
        }),

      // PWA plugin (service worker + asset caching)
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'robots.txt', 'pwa-192.png', 'pwa-512.png'],
        manifest: {
          name: 'Michael Njogu — Portfolio',
          short_name: 'Portfolio',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#1e3a8a',
          icons: [
            { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          // Keep common assets cached and use network-first for API calls
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            {
              urlPattern: /\/cdn\.contentful\.com\/.*/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'contentful-assets',
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 days
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'google-fonts-stylesheets' },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              urlPattern: /\/api\/.*/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
              },
            },
          ],
        },
      }),

      // Pre-compress assets (Brotli & gzip)
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        compressionOptions: { level: 11 },
      }),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
      }),
    ].filter(Boolean),

    build: {
      target: 'es2019',
      sourcemap: ANALYZE ? true : false,
      cssCodeSplit: true,
      brotliSize: true,
      minify: 'terser', // use terser for tighter control
      rollupOptions: {
        // terser rollup plugin for extra dead-code flags (keeps build deterministic)
        plugins: [terser()],
        output: {
          manualChunks(id) {
            if (!id) return;
            if (id.includes('node_modules')) {
              // tune these to your project's actual dependencies
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('framer-motion')) return 'vendor-framer-motion';
              if (id.includes('contentful')) return 'vendor-contentful';
              if (id.includes('react-router-dom')) return 'vendor-router';
              if (id.includes('react-bootstrap')) return 'vendor-bootstrap';
              if (id.includes('react-medium-image-zoom')) return 'vendor-zoom';
              if (id.includes('react-bootstrap-icons') || id.includes('bootstrap-icons')) return 'vendor-icons';
              return 'vendor';
            }
          },
          // smaller chunk file names help debugging while hashed names for prod
          chunkFileNames: isProd ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
          entryFileNames: isProd ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
          assetFileNames: isProd ? 'assets/[ext]/[name]-[hash].[ext]' : 'assets/[ext]/[name].[ext]',
        },
      },
      terserOptions: {
        compress: {
          passes: 2,
          // removes console.* in production
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
    },

    // Dev server
    server: {
      port: 5173,
      fs: { strict: true },
    },

    // Optional: explicitly optimize specific deps (pre-bundle)
    optimizeDeps: {
      include: [
        // tune if you have packages that cause cold start or need pre-bundling
        'react',
        'react-dom',
        'react-router-dom',
      ],
      esbuildOptions: {
        // keep ESNext where possible, faster builds
        target: 'es2019',
      },
    },
  };
});
