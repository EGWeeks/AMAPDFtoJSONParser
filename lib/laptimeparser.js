'use strict';

const jsonFormat = require('../node_modules/json-format/index');

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
	return jsonFormat(pageData, formatConfig);
}

module.exports = jsonParser;