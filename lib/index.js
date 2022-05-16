import { createFilter } from '@rollup/pluginutils'
import { resolve } from 'path'
import { createProcessor } from 'rollup-copy-transform-css'
import cssToModule from './css-to-module.js'
import handleError from './error.js'

export function litCss({
  include = ['**/*.css'], exclude, minify, inline, plugins,
  tag = 'css', specifier = 'lit'
} = {}) {
  const filter = createFilter(include, exclude)
  if (!(minify || plugins)) {
    inline = true
  }
  const processor = createProcessor({ minify, inline, plugins })

  return {
    name: 'lit-css',

    load(id) {
      if (filter(id)) {
        this.addWatchFile(resolve(id))
      }
    },

    async transform(source, id) { // eslint-disable-line consistent-return
      if (filter(id)) {
        try {
          const { css } = await processor.process(source, { from: id, map: false })
          return { code: cssToModule(css, tag, specifier), map: { mappings: '' } }
        } catch (err) {
          handleError.call(this, err)
        }
      }
    }
  }
}
