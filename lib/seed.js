'use strict';

var fs = require('fs'),
	MongoClient = require('mongodb').MongoClient,
	assert = require('assert');

var url = 'mongodb://localhost:27017/motocross';

MongoClient.connect(url, (err, db) => {
	assert.equal(null, err);
	console.log('Connected correctly to server');
	insertDocuments(db);
	db.close();
});

var filesArr = fs.readdirSync('./lap-times-json');
var requiredFile = [];

filesArr.forEach((val) => {
	var jsonData = require('../lap-times-json/'+val);
	requiredFile.push(jsonData);
});


var insertDocuments = function(db) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany(requiredFile, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted documents into the collection");
    console.log(result);
  });
};