'use strict';

require('dotenv').config();

// $ sh ./dbexcute/restoredb.sh DB_URL DB_USER DB_PW
// $ sh ./dbexcute/dropcollection.sh DB_URL DB_USER DB_PW

const execFile = require('child_process').execFile;


module.exports = {


	dropCollection : function (pathToJSON) {
		return new Promise((resolve, reject) => {
	    execFile('sh', ['./dbexecute/dropcollection.sh', process.env.DB_PATH, process.env.DB_USER, process.env.DB_PW], (error, stdout) => {
	      if(error) reject(error);
	      resolve(pathToJSON + ' ' + stdout);
	    });
	  });
	},


	toDB : function(pathToJSON) {
	  return new Promise((resolve, reject) => {
	    execFile('sh', ['./dbexecute/restoredb.sh', process.env.DB_URL, process.env.DB_USER, process.env.DB_PW], (error, stdout) => {
	      if(error) reject(error);
	      resolve(stdout);
	    });
	  });
	}

};