module.exports = function({addUtilities, addBase, e, theme, options}) {
        const fluidPrefix = options.prefix;
        const sizes = theme('utopia.textSizes', [])
        
        const minSize = theme('utopia.minSize')
        const minScale = theme('utopia.minScale')
        const minWidth = theme('utopia.minScreen', '').replace('px', '')
        
        const maxSize = theme('utopia.maxSize')
        const maxScale = theme('utopia.maxScale')
        const maxWidth = theme('utopia.maxScreen', '').replace('px', '')

        let root = {}
        let css = {
            ':root': root,
        }
        let staticFallbackSizes = {};
        let utopianSizes = [];


       
        if( options.useClamp === true ) {

            utopianSizes = sizes.map( (size, index) => {
                const baseIndex = sizes.indexOf(options.baseTextSize);
                const stepNum = index - baseIndex;
                const negativeStep = stepNum < 0;
                const absStep = Math.abs(stepNum);    
                
                if( stepNum == 0 ) {
                    var stepMin = minSize;
                    var stepMax = maxSize;
                } else {
                    var minFactor = Math.pow(minScale, absStep);
                    var maxFactor = Math.pow(maxScale, absStep);

                    if( negativeStep ) {
                        var stepMin = minSize / minFactor;
                        var stepMax = minSize / maxFactor;
                    } else {
                        var stepMin = minSize * minFactor;
                        var stepMax = minSize * maxFactor;
                    }
                }
                
                minWidthRem = minWidth / 16;
                maxWidthRem = maxWidth / 16;
                stepMinRem = stepMin / 16;
                stepMaxRem = stepMax / 16;

                const slope = (stepMaxRem - stepMinRem) / (maxWidthRem - minWidthRem);
                const yIntersection = (-1 * minWidthRem) * slope + stepMinRem;
                const slopeVW = slope * 100;

                return {
                    [`.${e(fluidPrefix)}text-${e(size)}`]: {
                        'font-size': `clamp( ${stepMinRem}rem, ${yIntersection}rem + ${slopeVW}vw, ${stepMaxRem}rem)`,
                    }
                }   
            });
            

        } else {

           
            
            utopianSizes = sizes.map( (size, index) => {
                const baseIndex = sizes.indexOf(options.baseTextSize);
                const stepNum = index - baseIndex;
                const negativeStep = stepNum < 0;
                const absStep = Math.abs(stepNum);    
                

                if( stepNum == 0 ) {
                    var stepMin = minSize;
                    var stepMax = maxSize;
                } else {
                    var minFactor = Math.pow(minScale, absStep);
                    var maxFactor = Math.pow(maxScale, absStep);


                    if( negativeStep ) {
                        var stepMin = minSize / minFactor;
                        var stepMax = maxSize / maxFactor;
                    } else {
                        var stepMin = minSize * minFactor;
                        var stepMax = maxSize * maxFactor;
                    }
                }


                const customPropertyName = `--text-size-${size}`;
                const fallback = stepMin / 16;
                
                // add custom property to :root styles
                root[`${customPropertyName}`] = `calc( ((${stepMin} / 16) * 1rem) + (${stepMax} - ${stepMin}) * var(--fluid-bp) )`;
                
                // add fallback size for browsers with no custom property
                // support (IE11)
                staticFallbackSizes[`.${e(fluidPrefix)}text-${size}`] = {
                     'font-size': `${fallback}rem`,
                }
                
                // add the main utility class referencing the custom p[roperty
                return {
                    [`.${e(fluidPrefix)}text-${size}`]: {
                        'font-size': `var(${customPropertyName}, ${fallback}rem)`,
                    }

                }
            });
            
        }
    
    addBase(css);
    //addUtilities(staticFallbackSizes);
    addUtilities(utopianSizes);
}

