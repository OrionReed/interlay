import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import webExtension, { readJsonFile } from "vite-plugin-web-extension"

export default defineConfig({
  optimizeDeps: {
    exclude: ['@tldraw/assets'],
  },
  plugins: [
    react(),
    webExtension({
      browser: 'firefox',
      manifest: () => {
        // Use `readJsonFile` instead of import/require to avoid caching during rebuild.
        const pkg = readJsonFile("package.json");
        const template = readJsonFile("manifest.json");
        return {
          ...template,
          version: pkg.version,
          name: pkg.name,
          description: pkg.description,
          author: pkg.author,
        };
      },
      webExtConfig: {
        startUrl: ["https://www.humprog.org/~stephen/", "https://theuselessweb.com/", "about:debugging#/runtime/this-firefox"],
      }
    }),
    viteStaticCopy({
      targets: [
        {
          // !! CAREFUL WITH THIS ONE !!
          src: '.env',
          dest: '.'
        }
      ]
    })
  ],

  build: {
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

