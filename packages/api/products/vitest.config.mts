import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/packages/api/products',
  test: {
    name: '@org/products',
    watch: false,
    globals: true,
    environment: 'node',
    setupFiles: ['../../../tools/test-delay/setup.mjs'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    reporters: ['default'],
    // One spec file at a time; Turborepo --concurrency owns all concurrency.
    fileParallelism: false,
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8',
      include: ['src/**/*.ts'],
    },
  },
});
