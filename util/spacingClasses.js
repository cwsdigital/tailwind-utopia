module.exports = {
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
