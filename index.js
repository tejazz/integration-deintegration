const patterns = require('./constants/patterns');
const { modifyRelatedFiles } = require('./functions/file-operation');
const { getExperimentList, getExperimentRelatedFiles } = require('./functions/file-traversal');
const experimentModel = require('./models/experiment-model');

let directoryPath = '../../codebase/agoda-com-dictator';
let operation = 'deintegration';      // ['integration', 'deintegration']
let enableTraversal = true;

getExperimentList(directoryPath, operation, enableTraversal, (operation) => {
    // select experiment
    let sampleExperiment = 'DEINDEX_LANDMARK_AND_LANDMARKACCOM';

    // find affected files
    let experimentFileList = getExperimentRelatedFiles(sampleExperiment);
    // console.log(experimentFileList);

    let experimentFileList = [
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.MVC.Api\\Constants\\TeamExperiments\\ExpId_Seo.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.UnitTest\\NewSite\\Service\\Seo\\SeoHreflangServiceTest.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.UnitTest\\NewSite\\Service\\Seo\\SeoServiceV2Test.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.MVC\\Areas\\NewSite\\Bots\\Services\\SeoHreflangService.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.MVC\\Areas\\NewSite\\Bots\\Services\\SeoIndexationService.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.MVC\\Areas\\NewSite\\Bots\\Services\\SeoServiceV2.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.MVC\\Areas\\NewSite\\Geography\\Repositories\\InAndAroundRepository.cs',
        '..\\..\\codebase\\agoda-com-dictator\\Src\\Agoda.Website\\Agoda.Website.MVC\\Areas\\NewSite\\Geography\\Repositories\\LandmarkProvider.cs'  
    ];

    // perform integration/de-integration (Complex)
    modifyRelatedFiles(experimentFileList, patterns, operation);

    // create PR
});


