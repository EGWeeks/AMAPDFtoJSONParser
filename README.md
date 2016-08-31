## AMA PDF to JSON parser

Built for the purpose of building an API for pro motocross data. I was not able to find any other data format other than PDFs from [american motocross results](http://americanmotocrossresults.com/). 

### Short Description 

The Node.js app is downloading all the lap time PDFs then parsing them to JSON. Some reading and writing to the drive in the middle. 
Then the last step is sending the JSON up to the hosted database connected to the [Pro Motocross API](http://promotocrossapi.com). This is one of the unique processes of the parser app. Instead of using a driver to connect to my hosted database I am use Node's core module Child Process to execute some shell files. For no particular purpose other than to test out child process, which is awesome.

###The beauty of promises
#### ./app.js
The benefits of chaining Promises, it reads like instructions on how to make ramen noodles.
Plus when we get a rejection we will know exactly what Promise it came from.
No need to preach to the chore.
```javascript 
// Version 2.0.0

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

Nothing wrong with async but a bit harder to read and more funny to debug.

```javascript
// Version 1.0.0

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
			return download(pdfLink).then(pdf => {
					let pdfFilePath = 'laptimes/moto'+index+'.pdf';
					let jsonFilePath = 'lap-times-json/moto'+index+'.json';
					fs.writeFile(pdfFilePath, pdf, err => {
						if(err) console.error('PDF write file threw '+ err);
						pdfTojson(pdfFilePath, jsonFilePath);
					});				
				});
		}))
	.then(res => console.log('Success! ' + res))
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