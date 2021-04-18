const placeholders = require("../constants/placeholders");
const ExperimentModel = require("../models/experiment-model");
const fs = require('graceful-fs');

function modifyRelatedFiles(fileList, patterns, operation) {
    let { currentExperiment } = ExperimentModel;

    // to remove
    currentExperiment = {
        '[EXP_NAME]': 'DEINDEX_LANDMARK_AND_LANDMARKACCOM',
        '[EXP_ID]': 'BAY-8971',
        '[IS_EXP]': 'isBay8971'
    };

    fileList.map((file) => {
        let data = fs.readFileSync(file).toString();

        patterns.map((patternElement) => {
            let pattern = patternElement.expression;

            pattern = preparePattern(pattern, currentExperiment);

            let regexPattern = new RegExp(pattern, 'gim');
            
            console.log(data.match(regexPattern));

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
        case 'AndExperiment':
            firstConditionIndex = data.indexOf('&&', matchIndex);
            patternMatch = data.match(pattern)[0];

            data = operation === 'deintegration'
                ? data.replace(pattern, `= ${false}`)
                : data.replace(patternMatch.substring(patternMatch.indexOf('&&')), '');

            break;
        case 'InvertAndExperiment':
            firstConditionIndex = data.indexOf('&&', matchIndex);
            patternMatch = data.match(pattern)[0];

            data = operation === 'deintegration'
                ? data.replace(patternMatch.substring(patternMatch.indexOf('&&')), '')
                : data.replace(pattern, `= ${false}`);

            break;
        case 'AndSeoUnifiedExperiment': 
            firstConditionIndex = data.indexOf(';', matchIndex);

            data = operation === 'integration'
                ? data.replace(data.substring(matchIndex, firstConditionIndex - 1), '')
                : data.replace(data.substring(data.lastIndexOf(' = ', matchIndex), firstConditionIndex), ` = false`);

            break;
        case 'AdditionalExperiment':
        case 'Single':
        default:
            data = data.replace(pattern, '');
            break;
    }

    fs.writeFileSync(filePath, data);
}

module.exports = { modifyRelatedFiles };
