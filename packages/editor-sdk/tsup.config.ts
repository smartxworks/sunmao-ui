import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  legacyOutput: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: false,
  metafile: true,
  platform: 'browser',
});
