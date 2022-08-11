import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib.ts', 'src/index.ts', 'src/widgets/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  inject: ['./react-import.js'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
});
