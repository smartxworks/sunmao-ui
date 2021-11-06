import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function virtualExamplePlugin(): Plugin {
  const virtualFileId = '@example.json';

  const exampleDir = path.join(__dirname, '../../examples');
  const examples = [];

  function walk(dirOrFile: string, frags: string[]) {
    if (fs.statSync(dirOrFile).isDirectory()) {
      for (const subDir of fs.readdirSync(dirOrFile)) {
        walk(path.join(dirOrFile, subDir), frags.concat(subDir));
      }
    } else {
      if (path.extname(dirOrFile) !== '.json') {
        return;
      }
      const value = JSON.parse(fs.readFileSync(dirOrFile, 'utf-8'));
      const name = frags.join('/');
      examples.push({ name, value });
    }
  }

  walk(exampleDir, []);

  return {
    name: 'virtual-example-plugin',
    resolveId(id) {
      if (id === virtualFileId) {
        return virtualFileId;
      }
    },
    load(id) {
      if (id === virtualFileId) {
        return JSON.stringify(examples);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
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
});
