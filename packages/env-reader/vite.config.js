import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'QuazalaEnvReader',
      fileName: (format) => `main.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/^node:/, 'events', 'stream', 'path'],
    },
    target: 'node16',
    minify: false,
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
