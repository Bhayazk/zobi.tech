const ANSI_COLORS = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    greenBright: "\x1b[92m",
    magentaBright: "\x1b[95m",
};

const colorText = (text, colorName) => {
    if (!colorName) return `${ANSI_COLORS.green}${text}${ANSI_COLORS.reset}`;
    return `${getAnsiColor(colorName)}${text}${ANSI_COLORS.reset}`;
};

const bgColorText = (text, colorName) => {
    if (!colorName) return `${ANSI_COLORS.green}${text}${ANSI_COLORS.reset}`;
    return `${getAnsiBgColor(colorName)}${text}${ANSI_COLORS.reset}`;
};

const myColorText = (text, colorName) => {
    const prefix = `${ANSI_COLORS.greenBright}[ BOT-MD ]${ANSI_COLORS.reset} `;
    if (!colorName) return `${prefix}${ANSI_COLORS.magentaBright}${text}${ANSI_COLORS.reset}`;
    return `${prefix}${getAnsiColor(colorName)}${text}${ANSI_COLORS.reset}`;
};

function getAnsiColor(colorName) {
    const map = {
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
    };
    return map[colorName.toLowerCase()] || ANSI_COLORS.green;
}

function getAnsiBgColor(colorName) {
    const map = {
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        gray: "\x1b[100m",
    };
    return map[colorName.toLowerCase()] || ANSI_COLORS.green;
}

module.exports = {
    colorText,
    bgColorText,
    myColorText
};
