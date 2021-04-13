const placeholders = require("../constants/placeholders");
const ExperimentModel = require("../models/experiment-model");
const fs = require('graceful-fs');

function modifyRelatedFiles(fileList, patterns, operation) {
    let { currentExperiment } = ExperimentModel;

    fileList.map((file) => {
        let data = fs.readFileSync(file).toString();

        patterns.map((pattern) => {
            pattern.replace('[EXP_NAME]', currentExperiment["[EXP_NAME]"]);
            pattern.replace('[EXP_ID]', currentExperiment["[EXP_ID]"]);

            if (data.search(pattern) !== -1) {
                console.log(data.replace(pattern, ''));
            }
        });
    });
}

module.exports = { modifyRelatedFiles };
