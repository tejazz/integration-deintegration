const patterns = require('./constants/patterns');
const { modifyRelatedFiles } = require('./functions/file-operation');
const { getExperimentList, getExperimentRelatedFiles } = require('./functions/file-traversal');
const experimentModel = require('./models/experiment-model');

let directoryPath = '../../codebase/agoda-com-dictator';
let operation = 'integration';      // ['integration', 'deintegration']

getExperimentList(directoryPath, operation, (operation) => {
    // select experiment
    let sampleExperiment = 'PRERENDER_HIDE_HOTEL_MAP';

    // find affected files
    let experimentFileList = getExperimentRelatedFiles(sampleExperiment);

    // perform integration/de-integration (Complex)
    modifyRelatedFiles(experimentFileList, patterns, operation);

    // create PR
});


