const plugin = require('tailwindcss/plugin')
const text = require('./lib/text')
const spacing = require('./lib/spacing')
const defaultOptions = {
  prefix: 'fl-',
  baseKey: 'base'
}

module.exports = plugin.withOptions(function (options) {
  options = Object.assign({}, defaultOptions, options)

  return function ({ addBase, theme }) {
    const { minWidth, maxWidth } = theme('utopia')

    addBase({
      ':root': {
        '--fluid-min-width': minWidth.toString(),
        '--fluid-max-width': maxWidth.toString(),

        '--fluid-screen': '100vw',
        '--fluid-bp': `calc(
          (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) /
          (var(--fluid-max-width) - var(--fluid-min-width))
        )`
      },

      [`@media (min-width: ${maxWidth}px)`]: {
        ':root': {
          '--fluid-screen': 'calc(var(--fluid-max-width) * 1px)'
        }
      }
    })

    addBase({ ':root': text.customProperties(theme, options) })
  }
}, function (options) {
  options = Object.assign({}, defaultOptions, options)

  return {
    theme: {
      extend: {
        fontSize: theme => text.sizes(theme, options),
        spacing: theme => spacing.sizes(theme, options)
      },
      utopia: {
        minWidth: 320,
        minSize: 21,
        minScale: 1.2,
        maxWidth: 1140,
        maxSize: 24,
        maxScale: 1.25,
        spacing: spacing.defaults,
        fontSize: text.defaults
      }
    }
  }
})
