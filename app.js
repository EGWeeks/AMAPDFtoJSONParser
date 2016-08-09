'use strict';

let fs = require('fs'),
	download = require('download'),
  PDFParser = require('./node_modules/pdf2json/PDFParser');

 function urlArr() {
 		const urlsToGet = [];

	for(var i = 1605; i < 1660; i += 5) {
		for(var n = 1; n < 3; n++) {
			urlsToGet.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F1RID.pdf");
			urlsToGet.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F2RID.pdf");
		}
	}
	return urlsToGet;
 };

function fetchLapTimesPDF() {

	Promise.all(
		urlArr().map(function(pdfLink){
			download(pdfLink).then((pdf, index) => {
					fs.writeFile('laptimes/moto'+index+'.pdf', pdf);
				});
		})).then(() => {
			console.log("Lap Time PDFs have been downloaded successfully.");	

		}).catch(reject => {
			console.error("Download ended in Error: "+ reject);
		});
}


function pdfTojson(pdf) {

	let inputStream = fs.createReadStream(pdf);
  let outputStream = fs.createWriteStream("./stuff.json");

  inputStream.pipe(new PDFParser()).pipe(new StringifyStream()).pipe(outputStream);

}
  
fetchLapTimesPDF();
  
