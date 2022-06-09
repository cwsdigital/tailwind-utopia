module.exports = function( { addBase, addUtilities, e, theme, options } ) {
    const classes = options.classes;

    const fluidPrefix = options.prefix;
    const scale = theme('utopia.spacingSizes', {});
    let pairs = unique(theme('utopia.spacingPairs', []));
    let generatedScale = theme('utopia.spacingScale', {});

    const contiguousPairs = Object.keys(scale).reduce((pairs, size, i, sizes) => {
        if (i === 0) return pairs
        pairs.push([sizes[i - 1], size])
        return pairs
    }, [])

    if( options.generateAllSpacingPairs ) {
        pairs = unique(contiguousPairs.concat(pairs))
    }

    let root = {}
    let css = {
        ':root': root,
    }
    let fallbackScale = {};

    let fallbackSpacings = {};

    Object.entries( scale ).forEach( ([size, multiplier]) => {
        generateProperties([size], [multiplier, multiplier])
    });

    pairs.forEach( ([fromSize, toSize]) => {
        if(!scale.hasOwnProperty(fromSize)) {
            throw 'Invalid `from` size provided in pairings';
        }

        if(!scale.hasOwnProperty(toSize)) {
            throw 'Invalid `to` size provided in pairings';
        }

        generateProperties([fromSize, toSize], [scale[fromSize], scale[toSize]])
    });

    const utopianSpacings = Object.entries( classes ).reduce( (result, [section, classes]) => {
        if( section == 'space' ) {
            Object.entries( scale ).map( ([size, multiplier], index) => {
                result.push( {
                    [`.${e(fluidPrefix)}space-x-${e(size)} > :not([hidden]) ~ :not([hidden])`]: {
                        '--tw-space-x-reverse': '0',
                        'margin-right': `calc(var(--fs-${size}) * var(--tw-space-x-reverse))`,
                        'margin-left': `calc(var(--fs-${size}) * calc(1 - var(--tw-space-x-reverse)))`,
                    },

                    [`.${e(fluidPrefix)}space-y-${e(size)} > :not([hidden]) ~ :not([hidden])`]: {
                        '--tw-space-y-reverse': '0',
                        'margin-top': `calc(var(--fs-${size}) * calc(1 - var(--tw-space-y-reverse)))`,
                        'margin-bottom': `calc(var(--fs-${size}) * var(--tw-space-y-reverse))`,
                    },
                });

            });

            pairs.forEach( ([fromSize, toSize]) => {
                result.push( {
                    [`.${e(fluidPrefix)}space-x-${e(fromSize)}-${e(toSize)} > :not([hidden]) ~ :not([hidden])`]: {
                        '--tw-space-x-reverse': '0',
                        'margin-right': `calc(var(--fs-${fromSize}-${toSize}) * var(--tw-space-x-reverse))`,
                        'margin-left': `calc(var(--fs-${fromSize}-${toSize}) * calc(1 - var(--tw-space-x-reverse)))`,
                    },

                    [`.${e(fluidPrefix)}space-y-${e(fromSize)}-${e(toSize)} > :not([hidden]) ~ :not([hidden])`]: {
                        '--tw-space-y-reverse': '0',
                        'margin-top': `calc(var(--fs-${fromSize}-${toSize}) * calc(1 - var(--tw-space-y-reverse)))`,
                        'margin-bottom': `calc(var(--fs-${fromSize}-${toSize}) * var(--tw-space-y-reverse))`,
                    },
                })
            });

        } else {

            Object.entries( classes ).map( ([className, attributes]) => {

                Object.entries( scale ).map( ([size, multiplier], index) => {

                    let properties = {};
                    let fallbackProperties = {};
                    attributes.forEach( (attribute) => {
                        if( className.startsWith('-') ){
                            properties[`${attribute}`] = `calc( var(--fs-${size}) * -1)`;
                            fallbackProperties[`${attribute}`] = `-${fallbackScale[size]}`;
                        } else {
                            properties[`${attribute}`] = `var(--fs-${size})`;
                            fallbackProperties[`${attribute}`] = `${fallbackScale[size]}`;
                        }
                    });

                    result.push( {
                        [`.${e(fluidPrefix)}${className}-${e(size)}`]: properties
                    });
                    fallbackSpacings[`.${e(fluidPrefix)}${className}-${e(size)}`] = fallbackProperties;

                });

                pairs.forEach( ([fromSize, toSize]) => {

                    let properties = {};
                    let fallbackProperties = {};
                    attributes.forEach( (attribute) => {
                        if( className.startsWith('-') ){
                            properties[`${attribute}`] = `calc( var(--fs-${fromSize}-${toSize}) * -1)`;
                            fallbackProperties[`${attribute}`] = `-${fallbackScale[fromSize + '-' + toSize]}`;
                        } else {
                            properties[`${attribute}`] = `var(--fs-${fromSize}-${toSize})`;
                            fallbackProperties[`${attribute}`] = `${fallbackScale[fromSize + '-' + toSize]}`;
                        }
                    });

                    result.push( {
                        [`.${e(fluidPrefix)}${className}-${e(fromSize)}-${e(toSize)}`]: properties
                    })
                    fallbackSpacings[`.${e(fluidPrefix)}${className}-${e(fromSize)}-${e(toSize)}`] = fallbackProperties;
                });

            });
        }

        return result;
    }, []);

    function generateProperties (sizes, multipliers) {
        const minSize = theme('utopia.minSize') * multipliers[0];
        const maxSize = theme('utopia.maxSize')  * multipliers[1];
        const property = sizes.join('-')

        root[`--fs-${property}`] = `calc( ${minSize/16}rem + (${maxSize} - ${minSize}) * var(--fluid-bp) )`,
        generatedScale[`${property}`] = `var(--fs-${property})`;
        fallbackScale[`${property}`] = `${minSize}px`;
    }

    addBase(css);

    if( options.generateFallbacks == true ){
        addUtilities(fallbackSpacings);
    }

    addUtilities(utopianSpacings);
}

function unique (array) {
    return Array.from(new Set(array.map(JSON.stringify))).map(JSON.parse)
}
