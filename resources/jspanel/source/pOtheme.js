var samples = ['primary', '#123456', '654321 ', 'red fillcolor yellow', 'rgb(100, 150, 32 )', 'hsl (54, 100%, 21%)', '--myColor', 'var(--myColor)', 'var( --myColor )',
    'hsl (54, 100%, 21%) filled', 'rgb(100, 150, 32 ) filledlight', 'red fillcolor var( -- myColor )', 'red fillcolor --myColor', 'bootstrap-primary filleddark',
    'mdb-info fillcolor afaf34'];

function pOtheme(optionTheme) {
    optionTheme = optionTheme.trim();
    console.log(optionTheme);
    var color,
        filling = '';

    if (optionTheme.match(/^(rgb|hsl|var)/)) {
        // for themes starting with rgb , hsl or var
        let devide = optionTheme.indexOf(')');
        color = optionTheme.slice(0, devide + 1).replace(/\s+/g, '');
        if (color.startsWith('var')) {
            color = jsPanel.getCssVariableValue(color);
        }
        filling = optionTheme.slice(devide + 1, optionTheme.length).trim();
    } else if (optionTheme.match(/^(#|\w|--)/)) {
        // for themes starting with #, [A-Za-z0-9_] or --
        let devide = optionTheme.indexOf(' ');
        if (devide > 0) {
            color = optionTheme.slice(0,devide + 1).replace(/\s+/g, '');
            filling = optionTheme.slice(devide + 1, optionTheme.length).trim();
        } else {
            color = optionTheme;
        }
        if (color.startsWith('--')) {
            color = jsPanel.getCssVariableValue(color);
        }
    }

    if (color.match(/^([0-9a-f]{3}|[0-9a-f]{6})$/gi)) {
        color = '#' + color;
    }

    if (filling.startsWith('fillcolor')) {
        let devide = filling.indexOf(' ');
        filling = filling.slice(devide + 1, filling.length).trim().replace(/\s+/g, '');
        if (filling.match(/^([0-9a-f]{3}|[0-9a-f]{6})$/gi)) {
            filling = '#' + filling;
        } else if (jsPanel.colorNames[filling]) {
            filling = '#' + jsPanel.colorNames[filling];
        } else if (filling.match(/^(--|var)/)) {
            filling = jsPanel.getCssVariableValue(filling);
        } else {
            filling = '#fff';
        }
    }

    return {color: color, colors: false, filling: filling};
}

samples.forEach(function(val, index, arr) {
    console.log(pOtheme(val));
});
