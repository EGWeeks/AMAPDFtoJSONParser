## AMA PDF to JSON parser

Built for the purpose of building an API for pro motocross data. I was not able to find any other data format other than PDFs from [american motocross results](http://americanmotocrossresults.com/). 

### Short Description 

The Node.js app is downloading all the lap time PDFs then parsing them to JSON. Some reading and writing to the drive in the middle. 
Then the last step is sending the JSON up to the hosted database connected to the [Pro Motocross API](http://promotocrossapi.com). This is one of the unique processes of the parser app. Instead of using a driver to connect to my hosted database I am use Node's core module Child Process to execute some shell files. For no particular purpose other than to test out child process, which is awesome.

###The beauty of promises
It is a much longer script but the beauty is at the bottom where everything is chained and reads like instructions in a cook book.
Plus when we get a rejection we will know exactly what Promise it came from.
No need to preach to the chore.
```javascript 
// Version 2.0.0
'use strict';

  const fs = require('fs'),
  download = require('download'),
 PDFParser = require('./node_modules/pdf2json/pdfparser'),
jsonParser = require('./lib/laptimeparser'),
 execFiles = require('./lib/exec.js');

function urlArr() {
	const urlsToGet = [];
	for(let i = 1605; i < 1665; i += 5) {
		for(let n = 1; n < 3; n++) {
			urlsToGet.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F1RID.pdf");
			urlsToGet.push("http://americanmotocrossresults.com/xml/MX/events/M"+ i +"/M"+ n +"F2RID.pdf");
		}
	}
	return urlsToGet;
}

// Will reject 404 returns
function getPDFs() {
	return Promise.all(urlArr().map(pdfLink => download(pdfLink)));
}

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
  		pdfParser.on('pdfParser_dagit staReady', jsonData => resolve(jsonData));
		});
	});
	return Promise.all(promises);
}

function sendToParser(allRaceJSON) {
	return Promise.resolve(jsonParser(allRaceJSON));
}

function unlinkFile(parsedJSON) {
	return new Promise((resolve, reject) => {
		fs.unlink('laptimes/allmoto.json', err => {
			if(err) reject(err);
			resolve(parsedJSON);
		});
	});
}

function writeJSONData(allRaceJSON) {
	let promises = allRaceJSON.map((eachRace, index) => {
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
	.then(parsedJSON => unlinkFile(parsedJSON))
	.then(allParsedJSON => writeJSONData(allParsedJSON))
	.then(pathToJSON => execFiles.dropCollection(pathToJSON[0]))
	.then(pathToJSON => execFiles.toDB(pathToJSON))
	.then(success => console.log(success+' Good To Go!'))
	.catch(err => console.error(err));
```

Nothing wrong with async but harder to read.

```javascript
// Version 1.0.0

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
```