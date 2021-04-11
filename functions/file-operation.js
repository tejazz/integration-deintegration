const placeholders = require("../constants/placeholders");
const ExperimentModel = require("../models/experiment-model");
const fs = require('graceful-fs');

function modifyRelatedFiles(fileList, patterns, operation) {
    let { currentExperiment } = ExperimentModel;
}

module.exports = { modifyRelatedFiles };
