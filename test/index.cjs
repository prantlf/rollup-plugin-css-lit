const { strictEqual } = require('node:assert')
const test = require('tehanu')(__filename)
const { litCss } = require('rollup-plugin-css-lit')

test('exports', () => {
  strictEqual(typeof litCss, 'function')
})
