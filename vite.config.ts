import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), dts({ 
    insertTypesEntry: true,
    staticImport: true,
    // rollupTypes: true,
    include: ['lib/**/*.ts']
   })],
  build: {
    lib: {
      entry: resolve(__dirname, './lib/index.ts'),
      name: 'svelte-autotracking',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `svelte-autotracking.${format}.js`,
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
  },

})


