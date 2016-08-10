'use strict';

const knex = require('knex')({client: 'pg'}),
	fs = require('fs');


function getDirFiles() {
	return fs.readdir('lap-times-json', function(err, files){
		if(err || files === undefined) console.log("error");
		return files.length;
	});
}

getDirFiles().then(function(val) {
	console.log(val);
});