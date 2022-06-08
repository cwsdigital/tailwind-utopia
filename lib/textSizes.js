module.exports = function({matchUtilities, addBase, e, theme, options}) {
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
        let utopianSizes = {};

        sizes.forEach( (size, index) => {
            const baseIndex = sizes.indexOf(options.baseTextSize);
            const stepNum = index - baseIndex;

            if(baseIndex === -1) {
                throw `Could not find baseStep: '${options.baseTextSize}' in the textSizes config.`;
            }
            const { clamp, calc, fallback } = fontSize(stepNum)
            staticFallbackSizes[size] = fallback

            if (options.useClamp) {
                utopianSizes[size] = clamp
            } else {
                const customPropertyName = `--text-size-${size}`
                root[`${customPropertyName}`] = calc
                utopianSizes[size] = `var(${customPropertyName}, ${fallback})`
            }
        });

    addBase(css);

    if( options.generateFallbacks == true ){
        matchUtilities(
            { [`${e(fluidPrefix)}text`]: (value) => ({ fontSize: value }) },
            { values: staticFallbackSizes }
        )
    }

    matchUtilities(
        { [`${e(fluidPrefix)}text`]: (value) => ({ fontSize: value }) },
        { values: utopianSizes }
    )

    function fontSize (stepNum) {
        const absStep = Math.abs(stepNum);

        if( stepNum == 0 ) {
            var stepMin = minSize;
            var stepMax = maxSize;
        } else {
            var minFactor = Math.pow(minScale, absStep);
            var maxFactor = Math.pow(maxScale, absStep);

            if( stepNum < 0 ) {
                var stepMin = minSize / minFactor;
                var stepMax = minSize / maxFactor;
            } else {
                var stepMin = minSize * minFactor;
                var stepMax = minSize * maxFactor;
            }
        }

        const minWidthRem = minWidth / 16;
        const maxWidthRem = maxWidth / 16;
        const stepMinRem = stepMin / 16;
        const stepMaxRem = stepMax / 16;

        const slope = (stepMaxRem - stepMinRem) / (maxWidthRem - minWidthRem);
        const yIntersection = (-1 * minWidthRem) * slope + stepMinRem;
        const slopeVW = slope * 100;

        return {
            clamp: `clamp( ${stepMinRem}rem, ${yIntersection}rem + ${slopeVW}vw, ${stepMaxRem}rem )`,
            calc: `calc( ((${stepMin} / 16) * 1rem) + (${stepMax} - ${stepMin}) * var(--fluid-bp) )`,
            fallback: `${stepMin / 16}rem`
        }
    }
}
