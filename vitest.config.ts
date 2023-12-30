import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    // deps: {
    //   external: [/src\/external\.mjs/],
    // },
  },
})
