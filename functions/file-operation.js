const placeholders = require("../constants/placeholders");
const ExperimentModel = require("../models/experiment-model");
const fs = require('graceful-fs');

function modifyRelatedFiles(fileList, patterns, operation) {
    let { currentExperiment } = ExperimentModel;

    console.log(fileList);

    fileList.map((file) => {
        let data = fs.readFileSync(file).toString();

        patterns.map((patternElement) => {
            let pattern = patternElement.expression;

            pattern = preparePattern(pattern, currentExperiment);

            let regexPattern = new RegExp(pattern, 'gi');

            if (data.match(regexPattern)) {
                evaluateFileChanges(data, regexPattern, patternElement.scenario, file, operation);
            }
        });
    });
}

function preparePattern(pattern, currentExperiment) {
    pattern = pattern.replace('[EXP_NAME]', currentExperiment['[EXP_NAME]'])
        .replace('[EXP_ID]', currentExperiment['[EXP_ID]'])
        .replace('[IS_EXP]', currentExperiment['[IS_EXP]']);

    return pattern;
}

function evaluateFileChanges(data, pattern, scenario, filePath, operation) {
    let matchIndex, firstConditionIndex, secondConditionIndex, lastIndex, extractedExperimentId, patternMatch;

    matchIndex = data.search(pattern);

    switch (scenario) {
        case 'ExperimentId':
            data = data.replace(pattern, '');

            break;
        case 'Ternary':
            firstConditionIndex = data.indexOf('?', matchIndex);
            secondConditionIndex = data.indexOf(':', matchIndex);
            lastIndex = data.indexOf(';', matchIndex);

            data = operation === 'deintegration'
                ? data.replace(data.substring(matchIndex, secondConditionIndex + 2), '')
                : data.replace(data.substring(matchIndex, firstConditionIndex + 2), '').replace(data.substring(secondConditionIndex - 1, lastIndex), '');

            break;
        case 'InvertTernary':
            firstConditionIndex = data.indexOf('?', matchIndex);
            secondConditionIndex = data.indexOf(':', matchIndex);
            lastIndex = data.indexOf(';', matchIndex);

            data = operation === 'integration'
                ? data.replace(data.substring(matchIndex, secondConditionIndex + 2), '')
                : data.replace(data.substring(matchIndex, firstConditionIndex + 2), '').replace(data.substring(secondConditionIndex - 1, lastIndex), '');

            break;
        case 'AndExperimentCheck':
            firstConditionIndex = data.indexOf('&&', matchIndex);
            patternMatch = data.match(pattern)[0];

            data = operation === 'deintegration'
                ? data.replace(pattern, `= ${false}`)
                : data.replace(patternMatch.substring(patternMatch.indexOf('&&')), '');

            break;
        case 'InvertAndExperimentCheck':
            firstConditionIndex = data.indexOf('&&', matchIndex);
            patternMatch = data.match(pattern)[0];

            data = operation === 'deintegration'
                ? data.replace(patternMatch.substring(patternMatch.indexOf('&&')), '')
                : data.replace(pattern, `= ${false}`);

            break;
        case 'MockExperimentManager':
            extractedExperimentId = pattern.slice(pattern.indexOf(`ExpId.`));

            data = data.replace(extractedExperimentId, '');
        case 'Single':
        default:
            data = data.replace(pattern, '');
            break;
    }

    fs.writeFileSync(filePath, data);
}

module.exports = { modifyRelatedFiles };
