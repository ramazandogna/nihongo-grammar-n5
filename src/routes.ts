import type { RouteRecordRaw } from 'vue-router'

/**
 * Routes are the folders under `src/pages`.
 *
 * `pages/n4/13-15/index.vue` becomes `/n4/13-15/`, so a new page is a new
 * folder (plus its line in `site.ts`) and nothing else. The trailing slash is
 * kept because the prerender writes `/n4/13-15/index.html`, and a static host
 * serves that file at exactly this address.
 */
const pages = import.meta.glob('./pages/**/index.vue')

export const routes: RouteRecordRaw[] = Object.entries(pages).map(([file, component]) => {
  const dir = file.replace('./pages', '').replace(/index\.vue$/, '')
  return { path: dir, component }
})

routes.push({ path: '/:rest(.*)*', redirect: '/' })
