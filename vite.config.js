import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/predict': 'http://127.0.0.1:8000',
      '/visitor-count': 'http://127.0.0.1:8000'
    }
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.js',
  },
  build: {
    // Generate source maps in production for better debugging
    sourcemap: true,
    // Minify the code for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements
        drop_debugger: true, // Remove debugger statements
      },
      mangle: {
        // Mangle variable and function names to make code harder to read
        toplevel: true,
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Split code into smaller chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'ai-vendor': ['@mlc-ai/web-llm', '@google/generative-ai', 'openai'],
        },
      },
    },
  },
})
