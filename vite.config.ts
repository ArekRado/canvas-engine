import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'
import path from 'node:path'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [
      dts({
        insertTypesEntry: true,
      }),
    ],
    build: {
      emptyOutDir: false,
      target: 'esnext',
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'canvas-engine',
        formats: ['es', 'umd'],
        fileName: (format) =>
          format === 'es' ? 'index.es.mjs' : 'index.umd.js',
      },
    },
  })
}
