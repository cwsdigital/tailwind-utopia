const { pair, calcValue } = require('./utils')

const defaults = {
  '3xs': 0.25,
  '2xs': 0.5,
  'xs': 0.75,
  'sm': 1,
  'md': 1.5,
  'lg': 2,
  'xl': 3,
  '2xl': 4,
  '3xl': 6
}

function sizes (theme, { prefix }) {
  const { minSize, maxSize, spacing } = theme('utopia')

  const tShirts = Object.entries(spacing).map(([name, multiplier]) =>
    [[name], [minSize * multiplier, maxSize * multiplier]]
  )
  const pairs = pair(Object.keys(spacing)).map(names =>
    [names, [minSize * spacing[names[0]], maxSize * spacing[names[1]]]]
  )

  return Object.fromEntries(tShirts.concat(pairs).map(([names, [min, max]]) =>
    [`${prefix}${names.join('-')}`, calcValue(min, max)]
  ))
}

module.exports = {
  defaults: Object.assign({}, defaults),
  sizes
}
