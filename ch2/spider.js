var request = require('request');
var mkdirp = require('mkdirp');
var path = require('path');
var utilities = require('./utilities');
var fs = require('fs');

// Callback hell
function spider(url, callback) {
  var filename = utilities.urlToFilename(url);
  fs.exists(filename, function(exists) {
    if(!exists) {
    	console.log("Downloading" + url);
      request(url, function(err, response, body) {
      	if(err) {
      		callback(err)
      	} else {
      		mkdirp(path.dirname(filename), function(err) {
      			if(err) {
      				callback(err);
      			} else {
      				fs.writeFile(filename, body, function(err) {
      					if (err) {
      						callback(err)
      					} else {
      						callback(null, filename, true);
      					}
      				});
      			}
      		});
      	}
      });
    } else {
    	callback(null, filename, false);
    }
  });
}

spider(process.argv[2], function(err, filename, downloaded) {
	if(err) {
		console.log(err);
	} else if(downloaded) {
		console.log('Compledted the download of"' + filename + '"');
	} else {
		console.log('"' + filename + '"was already downloaded');
	}
});