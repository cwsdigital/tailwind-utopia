module.exports = function( { addBase, addUtilities, e, theme, options } ) {
    const classes = options.classes; 
    
    const fluidPrefix = options.prefix;
    const scale = theme('utopia.spacingSizes', {});
    let pairs = theme('utopia.spacingPairs', {});
    const customPairs = theme('utopia.spacingCustomPairs',{});
    let generatedScale = theme('utopia.spacingScale', {}); 

    if( options.generateAllSpacingPairs === true ) {
        Object.entries( scale ).forEach( ([size,multiplier], index) => {
            if( index == Object.keys( scale).length-1) {
                //                 
            } else {
                pairs[size] = Object.keys(scale)[index+1]
            }
        });
    }

    let root = {}
    let css = {
        ':root': root,
    }
    let fallbackScale = {};

    let fallbackSpacings = {};



    Object.entries( classes ).forEach( (section, classes) => {

        Object.entries( scale ).map( ([size, multiplier], index) => {

            const minSize = theme('utopia.minSize') * multiplier;
            const maxSize = theme('utopia.maxSize') * multiplier;


            root[`--fs-${size}`] = `calc( ${minSize/16}rem + (${maxSize} - ${minSize}) * var(--fluid-bp) )`,
            generatedScale[`${size}`] = `var(--fs-${size})`;
            fallbackScale[`${size}`] = `${minSize}px`;
        });

        Object.entries( pairs ).map( ([fromSize, toSize], index) => {

            if(!scale.hasOwnProperty(fromSize)) {
                throw 'Invalid `from` size provided in pairings';
            }

            if(!scale.hasOwnProperty(toSize)) {
                throw 'Invalid `to` size provided in pairings';
            }

            const minSize = theme('utopia.minSize') * scale[fromSize];
            const maxSize = theme('utopia.maxSize')  * scale[toSize];

            root[`--fs-${fromSize}-${toSize}`] = `calc( ${minSize/16}rem + (${maxSize} - ${minSize}) * var(--fluid-bp) )`,
            generatedScale[`${fromSize}-${toSize}`] = `var(--fs-${fromSize}-${toSize})`;
            fallbackScale[`${fromSize}-${toSize}`] = `${minSize}px`; 
        });

        customPairs.forEach( (pair) => {
            Object.entries( pair ).map( ([fromSize, toSize], index) => {

                if(!scale.hasOwnProperty(fromSize)) {
                    throw 'Invalid `from` size provided in pairings';
                }

                if(!scale.hasOwnProperty(toSize)) {
                    throw 'Invalid `to` size provided in pairings';
                }

                const minSize = theme('utopia.minSize')  * scale[fromSize];
                const maxSize = theme('utopia.maxSize')  * scale[toSize];

                root[`--fs-${fromSize}-${toSize}`] = `calc( ${minSize/16}rem + (${maxSize} - ${minSize}) * var(--fluid-bp) )`,
                generatedScale[`${fromSize}-${toSize}`] = `var(--fs-${fromSize}-${toSize})`;
                fallbackScale[`${fromSize}-${toSize}`] = `${minSize}px`; 
            });
        });

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

            Object.entries( pairs ).map( ([fromSize, toSize], index) => {
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

            customPairs.forEach( (pair) => {
                Object.entries( pair ).map( ([fromSize, toSize], index) => {
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
            });

        } else {

            Object.entries( classes ).map( ([className, attributes]) => {

                Object.entries( scale ).map( ([size, multiplier], index) => {

                    let properties = {}; 
                    let fallbackProperties = {}; 
                    attributes.forEach( (attribute) => {
                        properties[`${attribute}`] = `var(--fs-${size})`;
                        fallbackProperties[`${attribute}`] = `${fallbackScale[size]}`;
                    });

                    result.push( {
                        [`.${e(fluidPrefix)}${className}-${e(size)}`]: properties
                    });
                    fallbackSpacings[`.${e(fluidPrefix)}${className}-${e(size)}`] = fallbackProperties;

                });

                Object.entries( pairs ).map( ([fromSize, toSize], index) => {

                    let properties = {}; 
                    let fallbackProperties = {}; 
                    attributes.forEach( (attribute) => {
                        properties[`${attribute}`] = `var(--fs-${fromSize}-${toSize})`;
                        fallbackProperties[`${attribute}`] = `${fallbackScale[fromSize+'-'+toSize]}`;
                    });

                    result.push( {
                        [`.${e(fluidPrefix)}${className}-${e(fromSize)}-${e(toSize)}`]: properties
                    })
                    fallbackSpacings[`.${e(fluidPrefix)}${className}-${e(fromSize)}-${e(toSize)}`] = fallbackProperties;
                });

                customPairs.forEach( (pair) => {
                    Object.entries( pair ).map( ([fromSize, toSize], index) => {

                        let properties = {}; 
                        let fallbackProperties = {}; 
                        attributes.forEach( (attribute) => {
                            properties[`${attribute}`] = `var(--fs-${fromSize}-${toSize})`;
                            fallbackProperties[`${attribute}`] = `${fallbackScale[fromSize+'-'+toSize]}`;
                        });

                        result.push( {
                            [`.${e(fluidPrefix)}${className}-${e(fromSize)}-${e(toSize)}`]: properties
                        })
                        fallbackSpacings[`.${e(fluidPrefix)}${className}-${e(fromSize)}-${e(toSize)}`] = fallbackProperties;

                    });
                });

            });
        }

        return result;
    }, []);

    addBase(css);

    if( options.generateFallbacks == true ){
        addUtilities(fallbackSpacings);
    }

    addUtilities(utopianSpacings);
} 

