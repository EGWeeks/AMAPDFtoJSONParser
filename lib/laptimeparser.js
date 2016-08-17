'use strict';

const jsonFormat = require('../node_modules/json-format/index');



function jsonObjParser(allJSONFiles) {
	let allJSONParsed = allJSONFiles.map((motoJSON) => {
		let pageData = {};
		let motoData = motoJSON.formImage.Pages;

		//each page inside a single PDF
		motoData.forEach(function(currPage, i){
			// each page has a text array full of obj with the data we care about
			// the rest is pdf jibberish
			currPage.Texts.forEach(function(singleData, n) {

				let raceData = decodeURI(singleData.R[0].T).replace(/^ /, '').replace(/%23/g, '#');
				if(n < 7 && i === 0) {
					let raceHeaders = raceData.replace(/%2C/g, ',');
					docHeaderParser(raceHeaders, n, pageData);
					if(n === 6) {
						pageData.riderData = [];
					}
				} else {
					let riderObj = pageData.riderData.length > 1 ? pageData.riderData[pageData.riderData.length - 1] : pageData.riderData[0];
					if(raceData.indexOf('#') === 0) {
						pageData.riderData.push({
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
		return pageData;
	});
	// const formatConfig = {type: 'space',size: 3};
	// return jsonFormat(pageData, formatConfig);

	return allJSONParsed;
}



function docHeaderParser(raceHeaders, index, pageData) {
	switch(index) {
		case 0:
			pageData.moto = parseInt(raceHeaders.charAt(raceHeaders.length - 1));
			break;
		case 1:
			pageData.series = raceHeaders;
			break;
		case 2:
			let trackLocation = raceHeaders.split('-');
			pageData.track = trackLocation[0].trim().replace(/\s/g, '-');
			pageData.location = trackLocation[1].trim();
			break;
		case 3:
			pageData.round = raceHeaders.charAt(7) === ' ' ? parseInt(raceHeaders.substr(6, 1)) : parseInt(raceHeaders.substr(6, 2));
			pageData.date = raceHeaders.substr(raceHeaders.indexOf('-') + 2);
			break;
		case 4:
			pageData.class = parseInt(raceHeaders.substr(0, 3));
			break;
		case 5:
			pageData.race = raceHeaders;
			break;
		default:
			pageData['racedata'+index] = raceHeaders;
			break;
	}
}

module.exports = jsonObjParser;