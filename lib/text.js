const { calcValue } = require('./utils')

const defaults = {
  'xs': 'inherit',
  'sm': 'inherit',
  'base': 1.4,
  'lg': 1.33,
  'xl': 1.2,
  '2xl': 1.11,
  '3xl': 1,
  '4xl': 1
}

function customProperties (theme, options) {
  const { fontSize } = theme('utopia')
  const props = {}
  Object.keys(fontSize).forEach(name => {
    let [min, max] = minMax(name, theme, options)
    min = min.toFixed?.call(min, 2) || min
    max = max.toFixed?.call(max, 2) || max

    props[`--f-${name}-min`] = min.toString()
    props[`--f-${name}-max`] = max.toString()
    props[`--f-${name}`] = calcValue(
      `var(--f-${name}-min)`,
      `var(--f-${name}-max)`
    )
  })
  return props
}

function sizes (theme, options) {
  const { fontSize } = theme('utopia')
  const names = Object.keys(fontSize)

  return Object.fromEntries(names.map(name => {
    const { lineHeight } = configFor(name, theme)
    return [`${options.prefix}${name}`, [`var(--f-${name})`, lineHeight]]
  }))
}

function configFor (name, theme) {
  const { fontSize } = theme('utopia')
  const value = fontSize[name]
  let { lineHeight, min, max } = value
  return {
    lineHeight: lineHeight || defaults[name],
    min: min || `var(--f-${name}-min)`,
    max: max || `var(--f-${name}-max)`,
  }
}

function minMax (name, theme, options) {
  const { fontSize, minSize, maxSize, minScale, maxScale } = theme('utopia')
  const { min: customMin, max: customMax } = fontSize[name]

  const names = Object.keys(fontSize)
  const baseIndex = names.indexOf(options.baseKey)
  const step = names.indexOf(name) - baseIndex
  const absStep = Math.abs(step)
  let min = minSize
  let max = maxSize

  if (step !== 0) {
    const minFactor = Math.pow(minScale, absStep)
    const maxFactor = Math.pow(maxScale, absStep)

    if (step < 0) {
      min = minSize / minFactor
      max = maxSize / maxFactor
    } else {
      min = minSize * minFactor
      max = maxSize * maxFactor
    }
  }
  return [customMin || min, customMax || max]
}

module.exports = {
  defaults: Object.assign({}, defaults),
  customProperties,
  sizes
}
