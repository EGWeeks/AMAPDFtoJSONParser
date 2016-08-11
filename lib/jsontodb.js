'use strict';

// const knex = require('knex')({client: 'pg', connection: { host : '127.0.0.1', database: 'motocross'}}),
	// const fs = require('fs');

// let getDirLength = () => {
// 	return new Promise((resolve, reject) => {
// 		fs.readdir('lap-times-json', (err, files) =>{
// 			if(err) reject(console.log("ERROR occured in fs readdir: "+ err));
// 			resolve(files);
// 		});
// 	});
// };

// let requireAllFiles = (fileNames) => {
// 	let requireNames = [];

// 	fileNames.forEach((val) => {
// 		requireNames.push(require('../lap-times-json/'+val));
// 	});

// 	return requireNames;
// };

// let createInsertPromise = (requiredJSON) => {
// 	requiredJSON.forEach((raceData, n) => {
// 		raceData.forEach((racePage, i)=> {
// 			racePage.forEach((riderData, x) => {
// 				knex('riders')
// 					.insert({
// 						name: riderData.name, 
// 						bike: riderData.bike,
// 						number: riderData.number })
// 					.then((id)=> {
// 						knex('laps')
// 							.insert()
// 					});
// 			});
// 		});
// 	});
// };



getDirLength()
	.then(files => requireAllFiles(files))
	.then(requiredJSON => createInsertPromise(requiredJSON))
	.then();

