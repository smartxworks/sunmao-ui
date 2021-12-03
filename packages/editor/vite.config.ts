import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { virtualExamplePlugin } from '@sunmao-ui/vite-plugins';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              throwIfNamespace: false, // defaults to true
              runtime: 'automatic',
              importSource: '@emotion/react',
            },
            'emotion-react',
          ],
        ],
      },
    }),
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
