const plugin = require('tailwindcss/plugin')
const textSizes = require('./lib/textSizes')
const fluidSpacing = require('./lib/fluidSpacing')
const classes = require('./util/spacingClasses')
const merge = require('lodash/merge');

module.exports = plugin.withOptions( function(options) {
    return function( { addBase, addUtilities, e, theme } ) {
        defaultOptions = {
            useClamp: false,
            prefix: 'fl:',
            baseTextSize: 'step-0',
            generateSpacing: true,
            generateAllSpacingPairs: true,
            generateFallbacks: true,
            classes: classes,
        } 
        
        const defaultTextSizes = [
            'step--2',
            'step--1',
            'step-0',
            'step-1',
            'step-2',
            'step-3',
            'step-4',
            'step-5',
        ]

        const defaultSpacingSizes = {
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


        const opts = merge({}, defaultOptions, options);


        let minWidth = theme('utopia.minScreen', '').replace('px', '')
        let maxWidth = theme('utopia.maxScreen', '').replace('px', '')
        
        ////////////////////////////////////////////////////////////////////////
        //
        // Due to the way Tailwind handles overriding in the theme: config
        // if we add the utopia: key there all the keys within it get
        // overwritten :-(
        //
        // So we provide empty defaults in the official default object, so they
        // can be easily extended by the user.
        //
        // If they are still empty after reading the theme config, then 
        //  the user hasn't supplied their own values we'll use our actual 
        //  defaults
        //
        ////////////////////////////////////////////////////////////////////////

        let userTheme = theme('utopia');
        if( theme('utopia.textSizes').length == 0 ) {
            userTheme['textSizes'] = defaultTextSizes
        }
        if( Object.keys( theme('utopia.spacingSizes') ).length == 0 ) {
            userTheme['spacingSizes'] = defaultSpacingSizes
        }

        if( opts.generateSpacing || !opts.useClamp ) {
            const rootProperties = {
                    ':root': {
                        '--fluid-min-width': minWidth,
                        '--fluid-max-width': maxWidth,

                        '--fluid-screen': '100vw',
                        '--fluid-bp': `calc( (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) / (var(--fluid-max-width) - var(--fluid-min-width)) )`,
                    },

                    [`@media (max-width: ${minWidth}px)`]: {
                        ':root': {
                            '--fluid-screen': 'calc(var(--fluid-min-width) * 1px)',           
                        },
                    },

                [`@media (min-width: ${maxWidth}px)`]: {
                        ':root': {
                            '--fluid-screen': 'calc(var(--fluid-max-width) * 1px)',           
                        },
                    },
                }

            addBase(rootProperties);
        }

        textSizes({
            theme: theme,
            e: e,
            addUtilities: addUtilities,
            addBase: addBase,
            options: opts,
        })

        if( opts.generateSpacing === true ) {
            fluidSpacing({
                theme: theme,
                e: e,
                addUtilities: addUtilities,
                addBase: addBase,
                options: opts,
            })
        }
       
        
    }
}, function(options) {
    return {
        theme: {
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
                spacingScale: {},
            }
        }
    }
})

