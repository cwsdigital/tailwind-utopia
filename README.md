# Tailwind Utopia
A TailwindCSS plugin to generate interpolated fluid typographic and spacing scales as created by the generator [utopia.fyi](https://utopia.fyi).

If you haven't already, visit [utopia.fyi](https://utopia.fyi) and familiarise yourself with the concepts.
* [Designing with fluid type scales](https://utopia.fyi/blog/designing-with-fluid-type-scales/) 
* [CSS only fluid scales](https://utopia.fyi/blog/css-modular-scales/)
* [Designing with fluid space palette](https://utopia.fyi/blog/designing-with-a-fluid-space-palette) 
* [Painting with fluid space palette](https://utopia.fyi/blog/painting-with-a-fluid-space-palette)

This plugin essentailly recreates the calculators from utopia.fyi within your tailwind config. 
* [Fluid type calculator](https://utopia.fyi/type/calculator)
* [Fluid space calculator](https://utopia.fyi/space/calculator)

## Installation
`npm install --save-dev cwsdigital/tailwind-utopia`

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
* A type scale with 2 negative steps and 5 positive steps from a 20px base size at the minumum screen size of 320px up to a 24px base size at the maximum screen size of 1140px, with the modular scale being 1.2 (minor third) at the minimum screen size and 1.25 (major third) at the maximum screen size.
* A fluid spacing scale with t-shirt sizes from 3xs up to 3xl, and utilities
  for each space-value pair in the scale 

### Typographic Scale
the default utility classes generated are as follows.
```
.fl:text-step--2 
.fl:text-step--1 
.fl:text-step-0 
.fl:text-step-1
.fl:text-step-2
.fl:text-step-3
.fl:text-step-4
.fl:text-step-5
```

### Spacing Scale
Out of the box this will generate a utility class for each entry in
the scale for most all of the Tailwind entries that utilise the spacing scale.
#### Default Scale
```
{
    '3xs': 0.25,
    '2xs': 0.5,
    'xs': 0.75,
    's': 1,
    'm': 1.5,
    'l': 2,
    'xl': 3,
    '2xl': 4,
    '3xl': 6,
}
```
#### Attributes
```
{
    margin: {
        'm': ['margin'],
        'mt': ['margin-top'],
        'mr': ['margin-right'],
        'mb': ['margin-bottom'],
        'ml': ['margin-left'],
        'mx': ['margin-left', 'margin-right'],
        'my': ['margin-top', 'margin-bottom'],
    },
    padding: {
        'p': ['padding'],
        'pt': ['padding-top'],
        'pr': ['padding-right'],
        'pb': ['padding-bottom'],
        'pl': ['padding-left'],
        'px': ['padding-left', 'padding-right'],
        'py': ['padding-top', 'padding-bottom'],
    },
    space: {
        'space-x': ['margin-left', 'margin-right'],
        'space-y': ['margin-top', 'margin-bottom'],
    },
    gap: {
        'gap': ['gap'],
        'gap-y': ['row-gap'],
        'gap-x': ['column-gap'],
    },
    width: {
        'w': ['width'],
    },
    height: {
        'h': ['height'],
    },
    position: {
        'top': ['top'],
        'bottom': ['bottom'],
        'left': ['left'],
        'right': ['right'],
        'inset': ['top', 'bottom', 'right', 'left'],
        'inset-x': ['left', 'right'],
        'inset-y': ['top', 'bottom']
    }
}
``` 
The plugin will also generate utilities for contiguous pais in the scale.  i.e.
'2xs-xs', 'xs-s', 's-m' and so on for the whole scale.  

Each size on the scale is also added as a CSS custom property onto the `:root`
selector (to enable you to use the spacings elsewhere in your styles).

Example default output:
```
:root {
    --fs-xs: calc(...);
    --fs-s: calc(...);
    ...
    --fs-xs-s: calc(...);
    ...
}

.fl\:ml-xs {
    margin-left: var(--fs-xs);
}
.fl\mr-xs { ... }
...
.fl\my-xs-s { ... }
...etc
```

## Customising your scales
The plugin is a standard Tailwind plugin, with its defaults set using a theme object.  So all the defaults can be extended within the `extend` entries within your Tailwind config file.

Below is the default theme used by the plugin:
```
utopia: {
    minScreen: '320px',
    minSize: 21,
    minScale: 1.2,
    maxScreen: '1140px',
    maxSize: 24,
    maxScale: 1.25,
    textSizes: [],
    spacingSizes: {},
    spacingPairs: {},
    spacingCustomPairs: [],
}

```
* **minScreen**: the screen size the scale starts at (unitless integer or px)
* **minSize**: the base font size at the minScreen size (unitless integer)
* **minScale**: the modular scale to use for type sizes at minScreen size
  (decimal)
* **maxScreen**: the screen size at which the scale stops increasing (unitless integer or px)
* **maxSize**: the base font size a the maxScreen size (unitless integer)
* **maxScale**: the modular scale to use at the maxScreen size (decimal)
* **textSizes**: your text size class names 
* **spacingsizes**: spacing scale class names and associated multiplier
* **spacingPairs**: only generate specified pairs
* **spacingCustomPairs**: non-contiguous spacing pairs to generate utilities for

It is possible to disable the generation of all spacing scale pairs (see configuration
below).  If you do this you can provide only the pairs you would like to
generate classes for using the `spacingPairs:` theme entry.

You can also generate wider spacings by providing custom pairings.  This is for
genrating scaling between non-contiguous scale entries. e.g. 's-xl', 'lg-2xl'

**N.B.** The `spacingPairs:` entry is an object, so can only have one key for each size.
The `spacingCustomPairs:` needs to be able to handle multiple pairs with the same
starting key e.g. 's-lg' and 's-2xl', so should be provided as an array of
objects.
```
pairs: {
    s: 'md',
    lg: 'xl'
},
customPairs: [
    { s: 'md' },
    { s: 'lg' },
    { lg: '2xl' }
]
```

You can reference other parts of your theme config if deisred (e.g. for using entries from your screens config).  An example customisation could look as follows:
```
{
  extend: {
    utopia: theme => ({
        minScreen: theme('screens.sm'),
        maxScreen: theme('screens.xl'),
        maxScale: 1.5,
        textSizes: [
            'xs',
            'sm',
            'base',
            'lg',
            'xl',
            '2xl',
            '3xl',            
        ],

    }),
  },
}
```
**N.B.** Due to the way Tailwind's theme and extend works this plugin provides
blank entries as it's default theme file - this means all customisation should
happen within the `extend:` key of the Tailwind config, and you will need to
provide the whole array of text and spacing sizes you require. If you leave the
sizes keys blank, only then will the plugin use it's defaults.

## Configuration Options
The plugin has the following options to configure the style of classes generated and how they are generated. 

<table>
  <tr>
    <th>Option</th><th>Default</th>
  </tr>
  <tr>
    <td>useClamp</td><td>false</td>
  <tr>
  <tr>
    <td>prefix</td><td>'fl:'</td>
  <tr>
  <tr>
    <td>baseTextSize</td><td>'step-0'</td>
  <tr>
  <tr>
    <td>generateSpacing</td><td>true</td>
  <tr>
  <tr>
    <td>generateAllSpacingPairs</td><td>true</td>
  <tr>
  <tr>
    <td>generateFallbacks</td><td>true</td>
  <tr>
</table>

To call the plugin with options you simply change how you call the plugin in the tailwind config file.
```
module.exports = {
  ...
  plugins: [
    utopia({
      useClamp: true,
      baseStep: 'base',
    })
  ]
}
```

#### useClamp
By default (and by design) utopia generates its scale using CSS custom properties and `calc()`.  It can also utilise the CSS `clamp()` function to generate succint one-line styles. e.g.
```
.fl\:text-step-0 {
  font-size: clamp(1rem, 0.7143rem + 1.4286vw, 2rem);
}
```
Setting this option to true will generate the clamp style of declarations. For more details on clamp, [Read this blog post from utopia.fyi](https://utopia.fyi/blog/clamp).

**N.B.** there are drawbacks to using clamp() - most notably for accessibility, as it can limit the users ability to zoom the text.  This can result in not meeting WCAG criteria.  For more details [see this post from Adrian Roselli](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html).

#### prefix
By default, this plugin will prefix all of the utility selectors with a prrefix of `fl:`.  You can customise this to whatever you choose with this config option. This is the default as it avoids collision with Tailwind's base (static) text sizes.

**Using an Empty Prefix** <br />
It is possible (preferable?) to have no prefix.
If doing this you may consider disbaling Tailwind's core fontSize plugin meaning that all the text sizes within your project will be fluid.
However it is unlikely that you will want to disable the core Spacing plugin, so
it is best to ensure that none of the keys in your spacingSizes will conflict
with Tailwind core defaults.
```
module.exports = {
...
plugins: [
      utopia({
          prefix: '',          
      }),
  ],
  corePlugins: {
     fontSize: false,
  }
}
```

#### baseTextSize
Internally, the plugin needs to know which steps in your scale are negative and which are positive. This is done by identifying the base step in your scale. Any entries in the sizes array before the base are considered negative, all those after are positive.

#### generateSpacing
Set to false to disable the generation of the fluid spacing utilities entirely.


#### generateAllPairs
When enabled generates utility classes for every set of contiguous pairs on the
scale. Defaults to true, which does generate a lot of classes, but you should
be utilising purgeCSS or similar to clean up unused classes from your production
output anyway.  However if you wish to limit the pairs that are generated, you
can disable this setting and provide a custom set of pairs in your theme config
(see above)

#### generateFalbacks
On by default, each utility will also have a static fallback size generated to
accommodate browsers that do not support CSS custom properties (IE11).  

**N.B.** Tailwind itself no longer officially supports IE11 and internally uses custom
properties for various effects.  As such, even with fallbacks on, the `space-x`
and `space-y` utiltities will not work.

## Usage Example: Fully replace Tailwind text classes with fluid versions
Using the following config it is possible to replace Tailwind's default typographic scale with a fluid scale, keeping the class names the same, enabling it to be retrofitted into an existing tailwind site.
```
const fluidTypography = require('tailwind-fluid-typography')
module.exports = {
  extend: {
    utopia: theme => ({
        minScreen: theme('screens.sm'),
        minSize: 16,
        minScale: 1.2,
        maxScreen: theme('screens.xl'),
        maxSize: 20,
        maxScale: 1.5,
      },
      textSizes: [
        'xs',
        'sm',
        'base',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        '8xl',
        '9xl',
      ]
    }),
  },
  plugins: [
      utopia({
        useClamp: false,
        prefix: '',
        baseStep: 'base',
      }),
  ]
}
```



## Usage Example: Accessing the generated scale
This plugin does one other thing that can be useful across your site.  the
plugin adds the generated scale to a key within the Tailwind config. You can
then reference this scale in other plugins.

The utopia.spacingScale entry will be the same structure as the default Tailwind theme
entry for spacing, but using the generated css variables for values:
```
utopia: {
    spacingScale: {
        xs: 'var(--fs-xs)',
        sm: 'var(--fs-sm)',
    }
}
```

To enable this feature simply add an entry of `spacingScale` into your theme
extends.

```
{
    theme: {
        anotherPlugin: theme => ({
            spacing: theme('utopia.spacingScale'),  
        }),
    },
    plugins: [
        utopia({
            prefix: ''

        }),
    ]
}
```

#### Caveats
In order for this to work the spacing plugin should come first in your plugins
array (or at least before any plugin that wants to consume the generated scale).

Much as it would be nice, it is not possible (as far as I can work out) to
modify the default `spacing` entry and have it picked up by the core Plugins. 

The core plugins all run (and have consumed the theme) before any custom plugins
have run, so the genrated scale is not present in the theme at the time the
corePlugins generate their utilities.


## License
Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements
Full credit for Utopia and the interpolated fluid type scales generated by this
plugin goes to [James Gilyead](https://twitter.com/j98) and [Trys Mudford](https://twitter.com/trysmudford).






