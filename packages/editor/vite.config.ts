import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { virtualExamplePlugin } from '@sunmao-ui/vite-plugins';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    virtualExamplePlugin(),
    react({
      jsxRuntime: 'classic',
    }),
  ],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
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
