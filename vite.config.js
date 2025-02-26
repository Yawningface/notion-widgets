import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures proper base path
  build: {
    outDir: 'dist', // Default output folder
  },
  server: {
    historyApiFallback: true, // ✅ Handles client-side routing in development
  }
});
