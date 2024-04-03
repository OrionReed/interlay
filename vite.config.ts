import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import webExtension from "vite-plugin-web-extension"

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      browser: 'firefox'
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

