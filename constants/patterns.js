const patterns = [
    {
        expression: `(\\w+\\s+){3}[EXP_NAME]\\s=\\s[EXP_ID];`,
        scenario: 'ExperimentId'
    },
    {
        expression: `expEval.Register\\(\\(.*ExpId.[EXP_NAME].*`,
        scenario: 'ExperimentId'
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
    {
        expression: `\=(.*)(\\n+\\s+)?\\&+\\s+experimentManager.IsBVariant\\(ExpId.[EXP_NAME]\\)`,
        scenario: 'AndExperimentCheck'
    },
    {
        expression: `\=(.*)(\\n+\\s+)?\\&+\\s+\\!experimentManager.IsBVariant\\(ExpId.[EXP_NAME]\\)`,
        scenario: 'InvertAndExperimentCheck'
    },
    // {
    //     expression: `Given.MockExperimentManager\\(\\).WithBVariants\\((.*+)?(\\n+)?(.*)?ExpId.[EXP_NAME]`,
    //     scenario: 'MockExperimentManager'
    // }
];

module.exports = patterns;
