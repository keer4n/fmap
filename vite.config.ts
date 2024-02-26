import { sveltekit } from '@sveltejs/kit/vite';
import {SvelteKitPWA} from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env.NODE_ENV' : process.env.NODE_ENV === 'production' ? '"production"' : '"development"'
  },
  plugins: [sveltekit(),
    SvelteKitPWA({
      srcDir: './src',
      mode: 'development',
      strategies: 'injectManifest',
      // for deployment in github pages repo `/fmap`
      scope: '/fmap/',
      // for deployment in github pages repo `/fmap`
      base: './',
      selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
      manifest: {
        short_name: 'Fmap',
        name: 'Fmap',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: '/logo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]

      },
      injectManifest: {
        globPatterns: ['client/**/*.{js,css,png}']
      },
      workbox: {
        globPatterns: ['client/**/*.{js,css,png}']
      },
      devOptions: {
        enabled: true,
        suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
        type: 'module',
        navigateFallback: '/'
      }
    })]
});
