'use strict';

require('dotenv').config();

// Create a child process with executable file method
const execFile = require('child_process').execFile;

module.exports = function() {
  // $ sh ./dbexcute/restoredb.sh DB_USER DB_PW
  return new Promise((resolve, reject) => {
    execFile('sh', ['./dbexecute/restoredb.sh', process.env.DB_URL, process.env.DB_USER, process.env.DB_PW], (error, stdout) => {
      if(error) reject(error);
      
      resolve(stdout);
    });
  });
};
