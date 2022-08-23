import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib.ts', 'src/index.ts', 'src/widgets/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  splitting: true,
  sourcemap: true,
  clean: true,
  metafile: true,
  platform: 'browser',
});
