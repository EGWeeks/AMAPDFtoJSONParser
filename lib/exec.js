'use strict';

const execFile = require('child_process').execFile;
const child = execFile('sh', ['./dbexcute/dumpdb.sh'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
  execFile('sh', ['./dbexcute/restoredb.sh', process.env.DB_USER, process.env.DB_PW], (error, stdout, stderr) => {
  	if (error) {
	    throw error;
	  }
	  console.log(stdout);
  });
});

