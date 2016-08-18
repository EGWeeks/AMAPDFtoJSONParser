'use strict';

require('dotenv').config();

// $ sh ./dbexcute/restoredb.sh DB_URL DB_USER DB_PW

const execFile = require('child_process').execFile;

module.exports = function() {
  return new Promise((resolve, reject) => {
    execFile('sh', ['./dbexecute/restoredb.sh', process.env.DB_URL, process.env.DB_USER, process.env.DB_PW], (error, stdout) => {
      if(error) reject(error);
      resolve(stdout);
    });
  });
};
