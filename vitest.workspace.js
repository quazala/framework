import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './packages/app/vite.config.js',
  './packages/env-reader/vite.config.js',
  './packages/file-structure-reader/vite.config.js',
  './packages/mongo-connector/vite.config.js',
  './packages/os-connector/vite.config.js',
  './packages/pg-connector/vite.config.js',
  './packages/rabbit-connector/vite.config.js',
  './packages/redis-connector/vite.config.js',
  './packages/router/vite.config.js',
  './packages/schema-validator/vite.config.js',
  './packages/server/vite.config.js',
]);
