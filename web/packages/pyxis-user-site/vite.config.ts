import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'pyxis-components': resolve(__dirname, '../pyxis-components/src'),
      'pyxis-components/*': resolve(__dirname, '../pyxis-components/src/*'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080',
      '/auth': 'http://localhost:8080',
      '/flyers': 'http://localhost:8080',
    },
  },
  preview: {
    port: 3000,
  },
});
