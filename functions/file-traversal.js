var path = require('path');
const fs = require('graceful-fs');
const ExperimentModel = require('../models/experiment-model');

function getExperimentList(filePath, operation, callback) {
    var finder = require('findit')(filePath);
    let startTime = Date.now();

    let fileIndex = {};
    let expFiles = [];

    finder.on('directory', function (dir, stat, stop) {
        var base = path.basename(dir);
        if (base === '.git' || base === 'node_modules') stop()
        else {
            fileIndex[dir] = 'dir';
        }
    });

    finder.on('file', function (file, stat) {
        fileIndex[file] = 'file';

        if (file.toLowerCase().includes('expid')) {
            expFiles.push(file);
        }
    });

    finder.on('link', function (link, stat) {
        fileIndex[link] = 'link';
    });

    finder.on('end', () => {
        console.log('Time taken: [File Traversal] ', (Date.now() - startTime) / 1000 + 's');

        let fileCount = 0;
        let dirCount = 0;
        let linkCount = 0;

        Object.keys(fileIndex).map((el) => {
            switch (fileIndex[el]) {
                case 'file': fileCount++;
                    break;
                case 'dir': dirCount++;
                    break;
                case 'link': linkCount++;
                    break;
            }
        })

        console.log('Directories Count: ', dirCount);
        console.log('Files Count: ', fileCount);
        console.log('Links Count: ', linkCount);
        console.log('Total Experiment Files: ', expFiles.length);

        ExperimentModel.experimentList = extractExperimentList(expFiles);
        ExperimentModel.fileIndex = fileIndex;

        callback(operation);
    });
}

function extractExperimentList(expFiles) {
    let expData = {};

    expFiles.map((file) => {
        let data = fs.readFileSync(file).toString();

        while (data.includes('public const string')) {
            let f1 = data.indexOf('public const string');
            let f2 = data.indexOf(';', f1);
            let substringArr = data.slice(f1, f2).split(' ');
            expData[substringArr[3]] = substringArr[5];
            data = data.replace(data.slice(f1, f2 + 1), '');
        }
    });

    return expData;
}

function getExperimentRelatedFiles(experimentName) {
    let startTime = Date.now();

    let fileList = [];
    let formats = [];
    let experimentId = ExperimentModel.experimentList[experimentName];
    let parsedExperimentId = experimentId.replace('"', '').split('-');
    let capitalizeExperimentName = parsedExperimentId[0].replace(/^\w/, (c) => c.toUpperCase());

    // prepare formats to search
    formats.push(experimentName);
    ExperimentModel.currentExperiment['[EXP_NAME]'] = experimentName;
    formats.push(experimentId);
    ExperimentModel.currentExperiment['[EXP_ID]'] = experimentId;
    formats.push(`isBay${experimentId}`);
    ExperimentModel.currentExperiment['[EXP_ISBAY]'] = `is${capitalizeExperimentName}${parsedExperimentId[1]}`;

    if (Object.keys(ExperimentModel.fileIndex).length === 0) {
        return fileList;
    }

    Object.keys(ExperimentModel.fileIndex).map((file) => {
        let isFileFormatValid = file.includes('.cs') || file.includes('.ts') || file.includes('.tsx');
        let isFile = fs.statSync(file).isFile();

        if (isFile && isFileFormatValid) {
            let data = fs.readFileSync(file).toString();
            
            formats.map((format) => {
                data.includes(format) ? fileList.push(file) : null;
            });
        } 
    });

    console.log(`Time taken: [Experiment Related Files] ${(Date.now() - startTime)/1000}s`);

    return fileList;
}

module.exports = { getExperimentList, getExperimentRelatedFiles };
