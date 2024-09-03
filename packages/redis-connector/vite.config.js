import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'QuazalaRedisConnector',
      fileName: (format) => `main.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/^node:/, 'events', 'stream', 'path'],
    },
    target: 'node18',
    minify: false,
  },
  test: { include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], globals: true, environment: 'node' },
});
