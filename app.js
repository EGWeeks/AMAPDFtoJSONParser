'use strict';

/*
	Built to get Pro Motocross lap times
	08/09/16 - Data could not be found in any other format but PDFs
	
	americanmotocrossresults.com
	fetchLapTimesPDF function needs to be invoked to get all the PDFS

*/

const fs = require('fs'),
	download = require('download'),
  PDFParser = require('./node_modules/pdf2json/pdfparser'),
  jsonParser = require('./lib/laptimeparser');



 function urlArr() {
 	const urlsToGet = [];

	for(let i = 1605; i < 1660; i += 5) {
		for(let n = 1; n < 3; n++) {
			urlsToGet.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F1RID.pdf");
			urlsToGet.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F2RID.pdf");
		}
	}
	return urlsToGet;
 }


function fetchLapTimesPDF() {
	Promise.all(
		urlArr().map((pdfLink, index) => {
			download(pdfLink).then(pdf => {
					let pdfFilePath = 'laptimes/moto'+index+'.pdf';
					let jsonFilePath = 'lap-times-json/moto'+index+'.json';
					fs.writeFile(pdfFilePath, pdf, err => {
						if(err) console.error('PDF write file threw '+ err);
						pdfTojson(pdfFilePath, jsonFilePath);
					});				
				});
		}))
	.then((res) => console.log(res))
	.catch(err => console.error('Promise all URLs ended in Error: '+ err));
}


function pdfTojson(pdfFilePath, jsonFilePath) {
  let pdfParser = new PDFParser();

  pdfParser.on('pdfParser_dataError', errData => console.error('PDFParser error : '+errData.parserError) );
  pdfParser.on('pdfParser_dataReady', jsonData => {

    fs.writeFile(jsonFilePath, jsonParser(jsonData), err => {
    	if(err) console.error('pdfParser write file error: '+ err);
    });
  });

  pdfParser.loadPDF(pdfFilePath);
}
