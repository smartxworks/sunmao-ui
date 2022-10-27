import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { virtualExamplePlugin } from '@sunmao-ui/vite-plugins';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), virtualExamplePlugin()],
  define: {
    // https://github.com/satya164/react-simple-code-editor/issues/86
    global: 'globalThis',
  },
});
