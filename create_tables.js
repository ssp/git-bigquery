console.log("[Google-BigQuery] Creating Tables");

const BigQuery = require('@google-cloud/bigquery');
var fs = require('fs');
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


const projectId = globalConfig.project_id;

const bigquery = BigQuery({
  projectId: projectId
});


//git Sub Dataset
var dataset = bigquery.dataset(globalConfig.dataset);



var commitsTable = "commits";
var filesTable = "files";
var contentsTable = "contents";
var diffTable = "diffs";
var refTable = "refs";

var commitsTable_options = {
  schema: [{
      "mode": "NULLABLE",
      "name": "commit",
      "type": "STRING"
    },
    {
      "mode": "REPEATED",
      "name": "parents",
      "type": "STRING"
    },
    {
      "mode": "NULLABLE",
      "name": "author",
      "type": "RECORD",
      "fields": [{
          "mode": "NULLABLE",
          "name": "name",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "email",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "time_sec",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "tz_offset",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "date",
          "type": "STRING"
        }
      ]
    },
    {
      "mode": "NULLABLE",
      "name": "committer",
      "type": "RECORD",
      "fields": [{
          "mode": "NULLABLE",
          "name": "name",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "email",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "time_sec",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "tz_offset",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "date",
          "type": "STRING"
        }
      ]
    },
    {
      "mode": "NULLABLE",
      "name": "message",
      "type": "STRING"
    },
    {
      "mode": "REPEATED",
      "name": "difference",
      "type": "RECORD",
      "fields": [{
          "mode": "NULLABLE",
          "name": "old_path",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "new_path",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "old_sha1",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "new_sha1",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "changed_lines",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "added_lines",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "deleted_lines",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "line_header",
          "type": "STRING"
        }
      ]
    },
    {
      "mode": "NULLABLE",
      "name": "repo_name",
      "type": "STRING"
    }
  ]
};


var filesTable_options = {
  schema: "repo_name:STRING,ref:STRING,path:STRING,id:STRING"
};


var contentsTable_options = {
  schema: "id:STRING,size:INTEGER,content:STRING,repo_name:STRING,path:STRING"
};

var diffTable_options = {
  schema: [{
      "mode": "NULLABLE",
      "name": "repo_name",
      "type": "STRING"
    },
    {
      "mode": "NULLABLE",
      "name": "commit",
      "type": "STRING"
    },
    {
      "mode": "REPEATED",
      "name": "difference",
      "type": "RECORD",
      "fields": [{
          "mode": "NULLABLE",
          "name": "old_path",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "new_path",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "old_sha1",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "new_sha1",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "changed_lines",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "added_lines",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "deleted_lines",
          "type": "INTEGER"
        },
        {
          "mode": "NULLABLE",
          "name": "line_header",
          "type": "STRING"
        },
        {
          "mode": "NULLABLE",
          "name": "diff_contents",
          "type": "STRING"
        }
      ]
    }
  ]
}

var refTable_options = {
  schema: "ref:STRING,name:STRING,time_sec:INTEGER,repo_name:STRING"
};



console.log("[Good] Creating the TABLES...");
dataset.createTable(commitsTable, commitsTable_options, function(err, table, apiResponse) {
  console.log("[Good] COMMITS TABLE WAS CREATED.");
});

dataset.createTable(filesTable, filesTable_options, function(err, table, apiResponse) {
  console.log("[Good] FILES TABLE WAS CREATED.");
});

dataset.createTable(contentsTable, contentsTable_options, function(err, table, apiResponse) {
  console.log("[Good] CONTENTS TABLE WAS CREATED.");
});

dataset.createTable(diffTable, diffTable_options, function(err, table, apiResponse) {
  console.log("[Good] DIFF TABLE WAS CREATED.");
});

dataset.createTable(refTable, refTable_options, function(err, table, apiResponse) {
  console.log("[Good] REFS TABLE WAS CREATED.");
});
