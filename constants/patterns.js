const patterns = [
    // still needs proof testing
    {
        expression: `&+(\\s+)?(\\n+\\s+)?SeoUnifiedExperimentDomain.IsExperimentEnabledForUserBotOrPreRender\\([\\s\\S]*?ExpId.[EXP_NAME]`,
        scenario: 'AndSeoUnifiedExperiment'
    },
    {
        expression: `(\\w+\\s+){3}[EXP_NAME](\\w+)?\\s=\\s"[EXP_ID]-?(\\w+)?";`,
        scenario: 'ExperimentId'
    },
    {
        expression: `expEval.Register\\(\\(.*ExpId.[EXP_NAME].*`,
        scenario: 'ExperimentId'
    },
    {
        expression: `\\,\\s*ExpId.[EXP_NAME]`,
        scenario: 'AdditionalExperiment'
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
        expression: `=\n*?(.*)?(\\n*\\s*)?(.*)?&+(\\n+\\s+)?\\s+(_)?experimentManager.IsBVariant\\(ExpId.[EXP_NAME]\\)`,
        scenario: 'AndExperiment'
    },
    {
        expression: `=\n*?(.*)?(\\n*\\s*)?(.*)?&+(\\n+\\s+)?\\s+\\!(_)?experimentManager.IsBVariant\\(ExpId.[EXP_NAME]\\)`,
        scenario: 'InvertAndExperiment'
    }, 
];

module.exports = patterns;
