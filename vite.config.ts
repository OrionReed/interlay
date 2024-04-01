import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
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
        entryFileNames: "[name].js", // For entry chunks
        chunkFileNames: "[name].js", // For non-entry chunks
        assetFileNames: "[name].[ext]" // For static assets like images and styles
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

