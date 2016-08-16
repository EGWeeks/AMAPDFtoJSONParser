'use strict';

require('dotenv').config();

// Create a child process with executable file method
const execFile = require('child_process').execFile;

// First argument is the command to run and second is an optional commands stored in array
// For my use case using execFile is a bit excessive and I tried exec method
// it's the same thing except execFile doesn't spawn a new shell like exec
// making execFile slightly more efficent because it just spawns a new process
// Plus it looks really cool when you have lime green on your github project description

// $ sh ./dbexcute/dumpdb.sh
// I have not been able to get stdout to log anything
// but if it doesn't throw error it will normally just log a blank line
execFile('sh', ['./dbexecute/dumpdb.sh'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);

  // Once the process has dumped my db (above) run the restore hosted db (below)
  // I'm passing my hosted db username and password as command line arguments
  // because I know Luke would steal them and drop my db
  // this is the same thing as before except if you go into ./dbexcute/restoredb.sh
  // you'll see how to access CL args with shell script!

  // $ sh ./dbexcute/restoredb.sh DB_USER DB_PW
	execFile('sh', ['./dbexecute/restoredb.sh', process.env.DB_USER, process.env.DB_PW], (error, stdout, stderr) => {
  	if (error) {
	    throw error;
	  }
	  console.log(stdout);
  });
});

