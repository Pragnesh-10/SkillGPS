import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import javascriptObfuscator from 'vite-plugin-javascript-obfuscator'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/predict': 'http://127.0.0.1:8000',
      '/visitor-count': 'http://127.0.0.1:8000'
    }
  },
  plugins: [
    react(),
    javascriptObfuscator({
      rotateStringArray: true,
      stringArray: true,
      identifierNamesGenerator: 'hexadecimal'
    }, {
      include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
      exclude: [/node_modules/],
      apply: 'build'
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.js',
  },
  build: {
    // Disable source maps in production to hide original code
    sourcemap: false,
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
        entryFileNames: '[hash].js',
        chunkFileNames: '[hash].js',
        assetFileNames: '[hash][extname]'
      },
    },
  },
})
