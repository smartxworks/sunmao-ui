import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { virtualExamplePlugin } from '@sunmao-ui/vite-plugins';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    virtualExamplePlugin(),
  ],
  define: {
    // https://github.com/satya164/react-simple-code-editor/issues/86
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, './index.html'),
        playground: resolve(__dirname, './playground.html'),
      },
    },
  },
});
