import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'QuazalaServer',
      fileName: (format) => `main.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/^node:/, 'events', 'stream', 'path', 'ws'],
      output: {
        globals: {
          ws: 'WebSocket',
        },
      },
    },
    target: 'node18',
    minify: false,
  },
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'node',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
