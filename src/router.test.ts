import { describe, expect, it } from 'vitest'

import { router } from '@/router'

import renderBlueprint from '../render.yaml?raw'

function renderRewriteSource(routePath: string): string {
  return routePath.replace(/:[^/]+/g, '*')
}

describe('Render blueprint', () => {
  const appPaths = router.routes
    .flatMap((route) => route.children ?? [])
    .map((route) => route.path)
    .filter((path): path is string => path !== undefined && path !== '/' && path !== '*')

  it.each(appPaths)('rewrites %s to index.html', (path) => {
    expect(renderBlueprint).toContain(
      `source: ${renderRewriteSource(path)}\n        destination: /index.html`,
    )
  })
})
