/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginSingleSpa from 'vite-plugin-single-spa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vitePluginSingleSpa({
      serverPort: 3001,
      spaEntryPoints: 'src/main.tsx',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3001,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5263',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mts',
  },
});
