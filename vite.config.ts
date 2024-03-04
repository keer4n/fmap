import { sveltekit } from '@sveltejs/kit/vite';
import {SvelteKitPWA} from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

const productionEnv = process.env.NODE_ENV === 'production';
export default defineConfig({
  define: {
    // required by sveltekit pwa
    'process.env.NODE_ENV' : productionEnv ? '"production"' : '"development"'
  },
  plugins: [sveltekit(),
    SvelteKitPWA({
      srcDir: './src',
      mode: productionEnv ? 'production':'development',
      strategies: 'injectManifest',
      // for deployment in github pages repo `/fmap`
      scope: productionEnv ? '/fmap/': '/',
      // for deployment in github pages repo `/fmap`
      base: productionEnv ? './': '/',
      filename: 'service-worker.ts',
      selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
      manifest: {
        short_name: 'Fmap',
        name: 'Fmap',
        start_url: productionEnv ? '/fmap/': '/',
        scope: productionEnv ? '/fmap/': '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: './logo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './logo-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]

      },
      injectManifest: {
        globPatterns: ['client/**/*.{js,css,ico,png,svg,webmanifest}']
      },
      workbox: {
        globPatterns: ['client/**/*.{js,css,png,ico,svg,webmanifest}']
      },
      devOptions: {
        enabled: true,
        suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
        type: 'module',
        navigateFallback: '/'
      },
      kit: {
        includeVersionFile: true,
      }
    })]
});
