'use strict';

const execFile = require('child_process').execFile;
const child = execFile('lib/commands/dumpdb.sh', (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});

