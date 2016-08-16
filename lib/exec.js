'use strict';

require('dotenv').config();

// Create a child process with executable file method
const execFile = require('child_process').execFile;

// First argument is the command to run and second is an optional commands stored in array
// For my use case I wanted to keep my shell commands in a seperate file
// Plus it looks really cool when you have lime green on your github project description

//$ sh ./dbexcute/dumpdb.sh
// I have not been able to get stdout to log anything
// but if it doesn't throw error it will normally just log a blank line
execFile('sh', ['./dbexcute/dumpdb.sh'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);

  // Once the I have dumped my db run the restore hosted db
  // I'm passing my hosted db username and password as comman line arguments
  // because I know like would steal them and drop my db
  // this is the same thing as before except if you go into ./dbexcute/restoredb.sh
  // you'll see how to access CL args with shell script!
  
  //$ sh ./dbexcute/restoredb.sh username password
	execFile('sh', ['./dbexcute/restoredb.sh', process.env.DB_USER, process.env.DB_PW], (error, stdout, stderr) => {
  	if (error) {
	    throw error;
	  }
	  console.log(stdout);
  });
});

