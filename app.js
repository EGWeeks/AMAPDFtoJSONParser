'use strict';

const fs = require('fs'),
	download = require('download'),
  PDFParser = require('./node_modules/pdf2json/pdfparser'),
  jsonFormat = require('./node_modules/json-format/index');



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
		})).then(() => {
			console.log('Lap Time PDFs have been downloaded successfully.');
		}).catch(reject => {
			console.error('Download ended in Error: '+ reject);
		});
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

function jsonParser(jsonData) {
	let pageData = [];
	let motoData = jsonData.formImage.Pages;

	motoData.forEach(function(currPage, i){
		pageData.push({});

		currPage.Texts.forEach(function(singleData, n) {
			var raceData = decodeURI(singleData.R[0].T).replace(/^ /, '').replace(/%23/g, '#');
			if(n < 7) {
				pageData[i]["raceData" + n] = raceData.replace(/%2C/g, ',');
				if(n === 6) {
					pageData[i].riderData = [];
				}
			} else {
				var riderObj = pageData[i].riderData.length > 1 ? pageData[i].riderData[pageData[i].riderData.length - 1] : pageData[i].riderData[0];
				if(raceData.indexOf('#') === 0) {
					pageData[i].riderData.push({
						number: raceData
					});
				}else if(/[A-Z]/.test(raceData[0]) && raceData[1] === '.'){
					riderObj.name = raceData;
				}else if(raceData === 'KAW' || raceData === 'YAM' || raceData === 'HON' || raceData === 'SUZ' || raceData === 'KTM' || raceData === 'HUS') {
					riderObj.bike = raceData;
				}else if(raceData.length < 3) {
				 	riderObj[raceData] = currPage.Texts[n + 1].R[0].T.replace(/%3A/g, '.');
				}
			}
		});		
	});
	const formatConfig = {type: 'space',size: 3};
	// let stringedData = JSON.stringify(pageData);
	return jsonFormat(pageData, formatConfig);
}
  
fetchLapTimesPDF();
