const patterns = require('./constants/patterns');
const { modifyRelatedFiles } = require('./functions/file-operation');
const { getExperimentList, getExperimentRelatedFiles } = require('./functions/file-traversal');
const experimentModel = require('./models/experiment-model');

let directoryPath = '../../codebase/agoda-com-dictator';
let operation = 'deintegration';      // ['integration', 'deintegration']

getExperimentList(directoryPath, operation, (operation) => {
    // select experiment
    let sampleExperiment = 'PRERENDER_HIDE_HOTEL_MAP';

    // find affected files
    // let experimentFileList = getExperimentRelatedFiles(sampleExperiment);

    let experimentFileList = [
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.MVC.Api\\Constants\\TeamExperiments\\ExpId_Seo.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Website.Cronos\\Property\\Agoda.Cronos.Property\\Builders\\ViewModels\\SeoParamsVmBuilder.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Website.Cronos\\Property\\Agoda.Cronos.Property\\Constants\\Experiments\\ExpId_Seo.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Website.Cronos\\Property\\Agoda.Cronos.PropertyUnitTests\\Builders\\ViewModels\\SeoParamsVmBuilderTest.cs',   
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.MVC\\Areas\\NewSite\\Property\\Builders\\PropertyPageParams\\SeoParamsBuilder.cs'
    ];

    // perform integration/de-integration (Complex)
    modifyRelatedFiles(experimentFileList, patterns, operation);

    // create PR
});


