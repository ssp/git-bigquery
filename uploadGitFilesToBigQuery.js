console.log("[Google-BigQuery] Uploading Content to BigQuery");
//Imports
const fs = require('fs');
const util = require('util');
const commandLineArgs = require('command-line-args');

//Passed Arguments via commandLineArgs
const optionDefinitions = [
  {
    name: 'config',
    alias: 'c',
    type: String
  }
];
const options = commandLineArgs(optionDefinitions);
const configFile = options.config;

var configPath;

if (configFile == undefined) {
  configPath = 'configuration.json';
}
else {
  configPath = options.config;
}

//Load Config File
const globalConfig = JSON.parse(fs.readFileSync(require("path").resolve(configPath)));

const BigQuery = require('@google-cloud/bigquery');

const projectId = globalConfig.project_id;

const bigquery = BigQuery({
  projectId: projectId
});


//git Sub Dataset
var dataset = bigquery.dataset(globalConfig.dataset);



var commitTable = dataset.table('commits');
var filesTable = dataset.table('files');
var contentsTable = dataset.table('contents');
var diffTable = dataset.table('diffs');
var refTable = dataset.table('refs');

function launchStreams() {

  console.log("[Good] Opening Commits File");
  console.log("[Good] Launching Write Stream for Commits");
  fs.createReadStream('../GitParsedContent/commits_bigquery-format.json')
    .pipe(commitTable.createWriteStream('json'))
    .on('complete', function(job) {
      job.on('error', function(err) {
        console.log("ERROR: Commits");
        console.log(err);
      });

      job.on('complete', function(metadata) {
        // console.log(util.inspect(metadata, false, null));
        console.log("[Good] Uploaded Commits to Database");
      });
    });

  console.log("[Good] Opening Diffs File");
  console.log("[Good] Launching Write Stream for Diffs");
  fs.createReadStream('../GitParsedContent/diffs_bigquery-format.json')
    .pipe(diffTable.createWriteStream('json'))
    .on('complete', function(job) {
      job.on('error', function(err) {
        console.log("ERROR: Diffs");
        console.log(err);
      });

      job.on('complete', function(metadata) {
        // console.log(util.inspect(metadata, false, null));
        console.log("[Good] Uploaded Diffs to Database");
      });
    });


  console.log("[Good] Opening Files File");
  console.log("[Good] Launching Write Stream for Files");
  fs.createReadStream('../GitParsedContent/files_bigquery-format.json')
    .pipe(filesTable.createWriteStream('json'))
    .on('complete', function(job) {
      job.on('error', function(err) {
        console.log("ERROR: Files");
        console.log(err);
      });

      job.on('complete', function(metadata) {
        // console.log(util.inspect(metadata, false, null));
        console.log("[Good] Uploaded Files to Database");
      });
    });


  console.log("[Good] Opening Contents File");
  console.log("[Good] Launching Write Stream for Contents");
  fs.createReadStream('../GitParsedContent/contents_bigquery-format.json')
    .pipe(contentsTable.createWriteStream('json'))
    .on('complete', function(job) {
      job.on('error', function(err) {
        console.log("ERROR: Commits");
        console.log(err);
      });

      job.on('complete', function(metadata) {
        // console.log(util.inspect(metadata, false, null));
        console.log("[Good] Uploaded contents to Database");
      });
    });


  console.log("[Good] Opening Refs File");
  console.log("[Good] Launching Write Stream for Refs");
  fs.createReadStream('../GitParsedContent/refs_bigquery-format.json')
    .pipe(refTable.createWriteStream('json'))
    .on('complete', function(job) {
      job.on('error', function(err) {
        console.log("ERROR: Refs");
        console.log(err);
      });

      job.on('complete', function(metadata) {
        // console.log(util.inspect(metadata, false, null));
        console.log("[Good] Uploaded Refs to Database");
      });
    });

}

launchStreams();
