'use strict';

var fs = require('fs'),
	download = require('download'),
	PDFParser = require('./node_modules/pdf2json/PDFParser'),
	jsonFormat = require('./node_modules/json-format/index');


// Only need to run once 
// PDFs will be stored in this project directory
// no need to execute on ever test 
// PDF only get added by AMA after races which ever weekend during summer
function fetchLapTimesPDF() {
	var promises = [];

	for(var i = 1605; i < 1660; i += 5) {
		for(var n = 1; n < 3; n++) {
			promises.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F1RID.pdf");
			promises.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F2RID.pdf");
		}
	}

	Promise.all(
		promises.map(function(pdfLink, index){
			download(pdfLink).then(function(dataPDF){
					fs.writeFile('laptimes/moto'+index+'.pdf', dataPDF);
				});
		})).then(function(){
			console.log("Lap Time PDFs have been downloaded successfully.");

		}).catch(function(reject) {
			console.log("Download ended in Error: "+ reject);
		});
}



// Reads the lap time directory &&
// calls the copy function on each pdf file
function readLapTimesDir() {
	fs.readdir('laptimes', function(err, motoFilesArr) {
		if(err) throw err;
		motoFilesArr.forEach(function(curr, index) {
			copyPDFToJSON(curr);
		});
	});
}



// Makes of copy of the pdf in JSON format
// Stores it in local laptimes directory
function copyPDFToJSON(filePath) {
	var formatConfig = {
		type: 'space',
		size: 3
	};
	var pdfParser = new PDFParser();

	pdfParser.on("pdfParser_dataError", function(errData){ 
		console.error(errData.parserError); 
	});
	pdfParser.on("pdfParser_dataReady", function(pdfData){
    fs.writeFile("./laptimes/"+filePath+".json", jsonFormat(pdfData, formatConfig));
	});

	pdfParser.loadPDF("./laptimes/"+filePath);

}

readLapTimesDir();

