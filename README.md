# Tailwind Utopia
A TailwindCSS plugin to generate interpolated fluid typographic and spacing scales as created by the generator [utopia.fyi](https://utopia.fyi).

If you haven't already, visit [utopia.fyi](https://utopia.fyi) and familiarize yourself with the concepts.
* [Designing with fluid type scales](https://utopia.fyi/blog/designing-with-fluid-type-scales/)
* [CSS only fluid scales](https://utopia.fyi/blog/css-modular-scales/)
* [Designing with fluid space palette](https://utopia.fyi/blog/designing-with-a-fluid-space-palette)
* [Painting with fluid space palette](https://utopia.fyi/blog/painting-with-a-fluid-space-palette)

This plugin essentially recreates the calculators from utopia.fyi within your Tailwind config.
* [Fluid type calculator](https://utopia.fyi/type/calculator)
* [Fluid space calculator](https://utopia.fyi/space/calculator)

## Installation
`npm install -D github:domchristie/tailwind-utopia`

## Getting Started
Require the plugin in your `tailwind.config.js` file and reference it in the plugins section.
```
module.exports = {
  theme: {
  ...
  },
  plugins: [
    require('tailwind-utopia')
  ]
}
```

Out of the box this will generate both a fluid type scale and a fluid space scale with the same defaults as the Utopia calculators:
* A type scale with 2 negative steps and 5 positive steps from a 21px base size at the minumum screen size of 320px up to a 24px base size at the maximum screen size of 1140px, with the modular scale being 1.2 (minor third) at the minimum screen size and 1.25 (major third) at the maximum screen size.
* A fluid spacing scale with t-shirt sizes from 3xs up to 3xl, and utilities for each space-value pair in the scale

### Typographic Scale
The default font-size utility classes are as follows:
```
text-fl-xs
text-fl-sm
text-fl-base
text-fl-lg
text-fl-xl
text-fl-2xl
text-fl-3xl
text-fl-4xl
```

### Spacing Scale
The default spacing utility classes are as follows:
```
<utility>-fl-3xs
<utility>-fl-2xs
<utility>-fl-xs
<utility>-fl-sm
<utility>-fl-md
<utility>-fl-lg
<utility>-fl-xl
<utility>-fl-2xl
<utility>-fl-3xl
```

Examples:
```
m-fl-lg
gap-fl-3xs
-space-x-fl-sm
```
#### Space Value Pairs
Utilities will be generated for any space value pairs. Separate t-shirt sizes with a `-`. Examples:
```
pt-fl-3xs-2xs // single step
m-fl-sm-lg // sm - lg step
```

## Customization
The plugin is a standard Tailwind plugin, with its defaults set using a theme object.  So all the defaults can be extended within the `extend` entries within your Tailwind config file.

Below is the default theme used by the plugin:
```
utopia: {
  minWidth: 320,
  minSize: 21,
  minScale: 1.2,
  maxWidth: 1140,
  maxSize: 24,
  maxScale: 1.25,
  fontSize: {
    'xs': 'inherit',
    'sm': 'inherit',
    'base': 1.4,
    'lg': 1.33,
    'xl': 1.2,
    '2xl': 1.11,
    '3xl': 1,
    '4xl': 1
  },
  spacing: {
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
}

```
* **minWidth**: the screen size the scale starts at in px (unitless integer)
* **minSize**: the base font size at the minScreen size (unitless integer)
* **minScale**: the modular scale to use for type sizes at minScreen size (decimal)
* **minScreen**: the screen size at which the scale stops increasing in px (unitless integer)
* **maxSize**: the base font size a the maxScreen size (unitless integer)
* **maxScale**: the modular scale to use at the maxScreen size (decimal)
* **fontSize**: the names, line-heights, and min/max text size configuration. The key determines the class name that will be generated. A non-object value will be used for the line-height. Alternatively, an object can configure the `lineHeight` and `min`/`max` values. For example:
  ```
  '4xl': {
    lineHeight: 0.88,
    min: 'var(--f-3xl-min)'
  }
  ```
  This overrides the `4xl` size, bringing the min size down to that of `3xl`. Unspecified values will use the defaults. Read [Utopian CSS generator, an iteration](https://utopia.fyi/blog/a-second-generator) for more on this approach.
* **spacing**: the names and multipliers for the spacing scale

You can reference other parts of your theme config if desired (e.g. for using entries from your screens config).  An example customization could look as follows:
```
{
  extend: {
    utopia: theme => ({
      minWidth: theme('screens.sm'),
      maxWidth: theme('screens.xl')
    }),
  },
}
```

## Configuration
The plugin has the following options to configure the style of classes generated and how they are generated.

<table>
  <tr>
    <th>Option</th><th>Default</th>
  </tr>
  <tr>
    <td>prefix</td><td>'fl-'</td>
  <tr>
  <tr>
    <td>baseKey/td><td>'base'</td>
  <tr>
</table>

To call the plugin with options you simply change how you call the plugin in the tailwind config file.
```
module.exports = {
  ...
  plugins: [
    require('tailwind-utopia')({
      prefix: 'f-'
    })
  ]
}
```

#### prefix
By default, this plugin will prefix all of the utility selectors with a prefix of `fl-`.  You can customise this to whatever you choose with this config option. This is the default as it avoids collision with Tailwind's base (static) text sizes.

#### baseKey
Internally, the plugin needs to know which steps in your scale are negative and which are positive. This is done by identifying the base step in your scale. Any entries in the sizes array before the base are considered negative, all those after are positive.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements
Full credit for Utopia and the interpolated fluid type scales generated by this
plugin goes to [James Gilyead](https://twitter.com/j98) and [Trys Mudford](https://twitter.com/trysmudford).
