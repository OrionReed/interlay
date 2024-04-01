import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import topLevelAwait from "vite-plugin-top-level-await";
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    topLevelAwait(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/background.js',
          dest: '.'
        }
      ]
    })
  ],

  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        // Configure output file names here
        entryFileNames: "[name].js", // For entry chunks
        chunkFileNames: "[name].js", // For non-entry chunks
        assetFileNames: "[name].[ext]" // For static assets like images and styles
      }
    }
  },
  publicDir: 'src/public',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

