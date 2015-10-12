var Promise = require('bluebird');
var utilities = require('./utilities');
var request = utilities.promisify(require('request'));
var mkdirp = utilities.promisify.(require('mkdirp'));
var path = require('path');
var fs = require('fs');
var readFile = utilities.promisify(fs.readFile);
var writeFile = utilities.promisify(fs.writeFile);
var async = require('async');

var downloadQueue = async.queue(function(taskData, callback) {
	spider(taskData.link, taskData.nesting - 1, callback);
}, 2)

function spider(url, nesting) {
	var filename = utilities.urlToFilename(url);
	return readFile(filename, 'utf8')
		.then(
			function(body) {
				return spiderLinks(url, body, nesting);
			},
			function(err) {
				if (err.code !== 'ENOENT') {
					throw err;
				}

				return download(url, filename)
					.then(function(body) {
						return spiderLinks(url, body, nesting);
					});
			}
		)
}

function saveFile(filename, content, callback) {
	mkdirp(path.dirname(filename), function(err) {
		if (err) {
			return callback(err)
		}
		fs.writeFile(filename, content, callback);
	})
}

function download (url, filename, callback) {
	console.log("Downloading" + url);
	var body;
	return request(url)
		.then(function(results) {
			body = results[1];
			return mkdirp(path.dirname(filename));
		})
		.then(function() {
			return writeFile(filename, body);
		})
		.then(function() {
			console.log('Downloaded and save' + url);
			return body;
		});
}

function spiderLinks (currentUrl, body, nesting, callback) {
	var promise = new Promise().resolve(); // start a chain = undefined
	if (nesting === 0) {
		return promise;
	}

	var links = utilities.getPageLinks(currentUrl, body);
	links.forEach(function(link) {
		promise = promise.then(function() {
			return spider(link, nesting - 1);
		});
	});

	// Paralle execution
	// if (nesting === 0) {
	// 	return Promise.resolve();
	// }
	// var links = utilities.getPageLinks*(currentUrl, body);
	// var promises = links.map(function(link) {
	// 	return spider(link, nesting -1);
	// });
	//
	// return Promise.all();

	return promise;
}

spider(process.argv[2], 1)
	.then(function() {
		console.log('Download completed');
	})
	.catch(function(err) {
		console.log(err);
	})
