'use strict';

const exec = require('child_process').exec;
const child = exec('mongodump -d motocross', (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});

