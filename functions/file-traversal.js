var path = require('path');
const fs = require('graceful-fs');
const ExperimentModel = require('../models/experiment-model');

function getExperimentList(filePath, operation, enableTraversal, callback) {
    if (!enableTraversal) return callback(operation);

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
            let experimentName = substringArr[3];
            let experimentId = substringArr[5] ? substringArr[5].replace(/"/g, '') : substringArr[5];

            // Club SEO User and Bot Experiments => One Experiment
            if ((experimentName && experimentId) && (experimentName.slice(-2) === '_U' || experimentName.slice(-2) === '_B')) {
                experimentName = experimentName.slice(0, experimentName.length - 2);
                experimentId = experimentId.replace('-U', '').replace('-B', '');
            }

            // Modify for KillSwitch
            if ((experimentName && experimentId) && (experimentName.slice(-3) === '_KS' || experimentId.slice(-3) === '-KS')) {
                experimentName = experimentName.slice(-3) === '_KS' ? experimentName.replace('_KS', '') : experimentName;
                experimentId = experimentId.slice(-3) === '-KS' ? experimentId.replace('-KS', '') : experimentId;
            }

            if (experimentId) expData[experimentName] = experimentId;

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
    let parsedExperimentId = experimentId.split('-');
    let capitalizeExperimentName = parsedExperimentId[0].replace(/^\w/, (c) => c.toUpperCase());

    // prepare formats to search
    formats.push(experimentName);
    ExperimentModel.currentExperiment['[EXP_NAME]'] = experimentName;
    formats.push(experimentId);
    ExperimentModel.currentExperiment['[EXP_ID]'] = experimentId;
    formats.push(`is${capitalizeExperimentName}${parsedExperimentId[1]}`);
    ExperimentModel.currentExperiment['[IS_EXP]'] = `is${capitalizeExperimentName}${parsedExperimentId[1]}`;

    if (Object.keys(ExperimentModel.fileIndex).length === 0) {
        return fileList;
    }

    Object.keys(ExperimentModel.fileIndex).map((file) => {
        let isFileFormatValid = file.includes('.cs') || file.includes('.ts') || file.includes('.tsx');
        let isFile = fs.statSync(file).isFile();

        if (isFile && isFileFormatValid) {
            let data = fs.readFileSync(file).toString();

            formats.map((format) => {
                if (data.toLowerCase().includes(format.toLowerCase())) {
                    fileList.findIndex((el) => el === file) === -1 ? fileList.push(file) : null;
                }
            });
        }
    });

    console.log(`Time taken: [Experiment Related Files] ${(Date.now() - startTime) / 1000}s`);

    return fileList;
}

module.exports = { getExperimentList, getExperimentRelatedFiles };
