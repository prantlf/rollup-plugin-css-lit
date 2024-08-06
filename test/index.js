import { fail, strictEqual } from 'node:assert'
import { fileURLToPath } from 'node:url'
import { rollup } from 'rollup'
import tehanu from 'tehanu'
import { litCss } from '../lib/index.js'

const test = tehanu(fileURLToPath(import.meta.url))

test('does not minify by default', async () => {
  const bundle = await rollup({
    input: 'test/flex-body.css',
    plugins: [litCss()],
    external: 'lit'
  })
  const { output } = await bundle.generate({});
  const { code } = output[0]
  strictEqual(code, `import { css } from 'lit';

var flexBody = css\`.control { display: flex }
body { display: flex }
\`;

export { flexBody as default };
`)
})

test('minifies', async () => {
  const bundle = await rollup({
    input: 'test/controls.css',
    plugins: [litCss({ minify: true })],
    external: 'lit'
  })
  const { output } = await bundle.generate({});
  const { code } = output[0]
  strictEqual(code, `import { css } from 'lit';

var controls = css\`.control{display:flex}\`;

export { controls as default };
`)
})

test('minifies with esbuild', async () => {
  const bundle = await rollup({
    input: 'test/controls.css',
    plugins: [litCss({ minify: { fast: true } })],
    external: 'lit'
  })
  const { output } = await bundle.generate({});
  const { code } = output[0]
  strictEqual(code, `import { css } from 'lit';

var controls = css\`.control{display:flex}
\`;

export { controls as default };
`)
})

test('handles broken input', async () => {
  try {
    await rollup({
      input: 'test/broken.txt',
      plugins: [litCss({ include: ['**/*.txt'] })],
      external: 'lit'
    })
    fail('processed broken input')
  } catch ({ message }) {
    strictEqual(message, ('[plugin lit-css] test/broken.txt (1:1): Unclosed block'))
  }
})
