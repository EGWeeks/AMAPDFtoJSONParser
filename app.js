'use strict';

let fs = require('fs'),
	download = require('download'),
  PDFParser = require('./node_modules/pdf2json/pdfparser');



 function urlArr() {
 	const urlsToGet = [];

	for(var i = 1605; i < 1660; i += 5) {
		for(var n = 1; n < 3; n++) {
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
					fs.writeFile(pdfFilePath, pdf, (err) => {
						if(err) console.error("PDF write file threw "+ err);
						pdfTojson(pdfFilePath, jsonFilePath);
					});				
				});
		})).then(() => {
			console.log("Lap Time PDFs have been downloaded successfully.");
		}).catch(reject => {
			console.error("Download ended in Error: "+ reject);
		});
}


function pdfTojson(pdfFilePath, jsonFilePath) {

		let inputStream = fs.createReadStream(pdfFilePath);
  	let outputStream = fs.createWriteStream(jsonFilePath);

  	return inputStream.pipe(new PDFParser()).pipe(new StringifyStream()).pipe(outputStream);

}
  
fetchLapTimesPDF();
  
