module.exports = function({addUtilities, e, theme, options}) {
        const fluidPrefix = options.prefix;
        const sizes = theme('utopia.textSizes', [])
        
        const minSize = theme('utopia.minSize')
        const minScale = theme('utopia.minScale')
        const minWidth = theme('utopia.minScreen', '').replace('px', '')
        
        const maxSize = theme('utopia.maxSize')
        const maxScale = theme('utopia.maxScale')
        const maxWidth = theme('utopia.maxScreen', '').replace('px', '')

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
                    var stepMax = minSize;
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

                return {
                    [`.${e(fluidPrefix)}text-${e(size)}`]: {
                        'font-size': `calc( ((${stepMin} / 16) * 1rem) + (${stepMax} - ${stepMin}) * var(--fluid-bp) )`,
                    }
                }
            });
            
        }

    addUtilities(utopianSizes);
}

