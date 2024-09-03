import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './packages/env-reader/vite.config.js',
  './packages/rabbit-connector/vite.config.js',
  './packages/pg-connector/vite.config.js',
]);
