import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    svelte(),
    svelteTesting(),
    dts({
      insertTypesEntry: true,
      staticImport: true,
      // rollupTypes: true,
      include: ['lib/**/*.ts']
    }),
  ],
  build: {
    lib: {
      entry: {
        '': resolve(__dirname, './lib/index.ts'),
      },
      name: 'svelte-autotracking',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName ? entryName + '/' : ''}svelte-autotracking.${format}.js`,
    },
    rollupOptions: {
      external: ['svelte'],
      output: {
        sourcemapExcludeSources: true,
        globals: {
          svelte: 'svelte',
          "svelte/store": "svelte/store",
        },
      },
    },
    minify: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      $app: resolve("./src"),
      $lib: resolve("./lib"),
    },
    conditions: mode === 'test' ? ['browser'] : [],
  },

  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },

}))


