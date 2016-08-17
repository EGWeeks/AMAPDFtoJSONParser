'use strict';

/*
	Built to get Pro Motocross lap times
	08/09/16 - Data could not be found in any other format but PDFs
	Programmed in an async style
	I know! I should have done it all in Promises.
	This is a thrown together prototype.

	americanmotocrossresults.com
	fetchLapTimesPDF function needs to be invoked to get all the PDFS
	Please be respectful of their servers
	Every PDF download hits the server
*/

  const fs = require('fs'),
  download = require('download'),
 PDFParser = require('./node_modules/pdf2json/pdfparser'),
jsonParser = require('./lib/laptimeparser'),
  execToDB = require('./lib/exec.js');

require('dotenv').config();



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



function getPDFs() {
	return Promise.all(urlArr().map((pdfLink) => download(pdfLink)));
}



function writePDFs(pdfs) {
	let promises = pdfs.map((pdf, index) => {
		return new Promise((resolve, reject) => {
			fs.writeFile('laptimes/moto'+index+'.pdf', pdf, (err) => {
				if(err) reject(err);
				resolve('laptimes/moto'+index+'.pdf');
			});
		});
	});

	return Promise.all(promises);
}



function getToJSON(pathsPDFs) {
	let promises = pathsPDFs.map((pathPDF) => {
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

function writeJSONData(allRaceJSON) {
	return new Promise((resolve, reject) => {
		fs.writeFile('laptimes/allmoto.json', JSON.stringify(allRaceJSON), (err) => {
			if(err) reject(err);
			resolve('./laptimes/allmoto.json');
		});
	});
}



getPDFs()
	.then(res => {
		return writePDFs(res);
	})
	.then(pathsPDFs => {
		return getToJSON(pathsPDFs);
	})
	.then(allRaceJSON => {
		return sendToParser(allRaceJSON);
	})
	.then(allParsedJSON => {
		return writeJSONData(allParsedJSON);
	})
	.then(pathToJSON => {
		return execToDB(pathToJSON);
	})
	.then(stuff => {
		console.log(stuff);
	})
	.catch(err => console.error('Promise all URLs ended in Error: '+ err));
