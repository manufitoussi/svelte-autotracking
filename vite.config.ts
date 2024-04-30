import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: 'lib/svelte-autotracking/index.ts',
      name: 'svelte-autotracking',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `svelte-autotracking.${format}.js`,
    },
    rollupOptions: {
      external: ['svelte'],
      output: {
        globals: {
          svelte: 'svelte',
        },
      },
    },
  },
  resolve: {
    alias: {
      $app: resolve("./src"),
      $lib: resolve("./lib"),
    },
  },

})


