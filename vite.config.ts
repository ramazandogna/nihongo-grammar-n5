import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import type { ViteSSGOptions } from 'vite-ssg'

import { sitePaths } from './src/site.ts'

export default defineConfig({
  // GitHub Pages serves the repo under /<repo>/; set VITE_BASE for that, `/` elsewhere.
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  ssgOptions: {
    // Every page is a real HTML file at the same URL the old site had: /n5/index.html …
    includedRoutes: () => sitePaths,
    dirStyle: 'nested',
    formatting: 'none',
  } satisfies Partial<ViteSSGOptions>,
})
