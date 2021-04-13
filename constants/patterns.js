const patterns = [
    {
        expression: `(\\w+\\s+){3}[EXP_NAME]\\s=\\s[EXP_ID];`,
        scenario: 'ExpId'
    },
    {
        expression: `experimentManager.IsBVariant(ExpId.[EXP_NAME])`,
        scenario: 'Single'
    },
    {
        expression: `experimentManager.IsBVariant\\(ExpId.[EXP_NAME]+\\)\\s+\\?(.*);`,
        scenario: 'Ternary'
    },
    {
        expression: `\!experimentManager.IsBVariant\\(ExpId.[EXP_NAME]+\\)\\s+\\?(.*);`,
        scenario: 'InvertTernary'
    },
];

module.exports = patterns;
