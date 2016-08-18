'use strict';

/*
	Built to get Pro Motocross lap times
	08/09/16 - Data could not be found in any other format but PDFs

	americanmotocrossresults.com
	Please be respectful of their servers
	Every PDF download hits their server
*/

  const fs = require('fs'),
  download = require('download'),
 PDFParser = require('./node_modules/pdf2json/pdfparser'),
jsonParser = require('./lib/laptimeparser'),
  execToDB = require('./lib/exec.js');

require('dotenv').config();


// Races increment by fives &
// Any race that has not occured returns 404
function urlArr() {
	const urlsToGet = [];
	for(let i = 1605; i < 1655; i += 5) {
		for(let n = 1; n < 3; n++) {
			urlsToGet.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F1RID.pdf");
			urlsToGet.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F2RID.pdf");
		}
	}
	return urlsToGet;
}


// Download returns Promise &
// Will reject 404 returns
function getPDFs() {
	return Promise.all(urlArr().map(pdfLink => download(pdfLink)));
}


// Writing for the PDF parser
// Requires a file 
function writePDFs(pdfs) {
	let promises = pdfs.map((pdf, index) => {
		return new Promise((resolve, reject) => {
			fs.writeFile('laptimes/moto'+index+'.pdf', pdf, err => {
				if(err) reject(err);
				resolve('laptimes/moto'+index+'.pdf');
			});
		});
	});
	return Promise.all(promises);
}



function getToJSON(pathsPDFs) {
	let promises = pathsPDFs.map(pathPDF => {
		return new Promise((resolve, reject) => {
			const pdfParser = new PDFParser();
			pdfParser.loadPDF(pathPDF);
			pdfParser.on('pdfParser_dataError', errData => reject(errData));
  		pdfParser.on('pdfParser_dataReady', jsonData => resolve(jsonData));
		});
	});
	return Promise.all(promises);
}



function sendToParser(allRaceJSON) {
	return Promise.resolve(jsonParser(allRaceJSON));
}


// Writing to send file on Mongo import exec
function writeJSONData(allRaceJSON) {
	let promises = allRaceJSON.map(eachRace => {
		return new Promise((resolve, reject) => {
			fs.appendFile('laptimes/allmoto.json', JSON.stringify(eachRace), err => {
				if(err) reject(err);
				resolve('./laptimes/allmoto.json');
			});
		});
	});
	return Promise.all(promises);
}



getPDFs()
	.then(pdfs => writePDFs(pdfs))
	.then(pathsPDFs => getToJSON(pathsPDFs))
	.then(allRaceJSON => sendToParser(allRaceJSON))
	.then(allParsedJSON => writeJSONData(allParsedJSON))
	.then(pathToJSON => execToDB(pathToJSON[0]))
	.catch(err => console.error(err));


