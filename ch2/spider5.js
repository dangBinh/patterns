var request = require('request');
var mkdirp = require('mkdirp');
var path = require('path');
var utilities = require('./utilities');
var fs = require('fs');
var async = require('async');

var TaskQueue = require('./TaskQueue');
var downloadQueue = new TaskQueue(2);

var spidering = {};
function spider(url, nesting, callback) {
	if (spidering[url]) {
		return process.nextTick(callback);
	}
	spidering[url] = true;
	var filename = utilities.urlToFilename(url);
	// read file asynchronous
	fs.readFile(filename, 'utf8', function(err, body) {
    if(err) {
      if(err.code !== 'ENOENT') {
        return callback(err);
      }
      
      return download(url, filename, function(err, body) {
        if(err) {
          return callback(err);
        }
        spiderLinks(url, body, nesting, callback);
      });
    }
    
    spiderLinks(url, body, nesting, callback);
  });
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

	async.series([
			function(callback) {
				request(url, function(err, response, resBody) {
					if (err) {
						return callback(err);
					}
					body = resBody;
					callback();
				});
			},
			mkdirp.bind(null, path.dirname(url)),
			function(callback) {
				fs.writeFile(filename, body, callback);
			}
		], function(err) {
			if (err) {
				return callback(err);
			}
			callback(null, body);
		});
}

function spiderLinks (currentUrl, body, nesting, callback) {
	if (nesting === 0) {
		return process.nextTick(callback);
	}

	var links = utilities.getPageLinks(currentUrl, body);
	if(links.length == 0) {
		return process.nextTick(callback);
	}

	async.eachSeries(links, function(link, callback) {
		spider(link, nesting -1, callback)
	}, callback);

	// Parallel
	/*
	async.each(links, function(link, callback) {
		spider(link, nesting -1, callback)
	}, callback);
	*/
	// Limit parallel
	async.queue(links, function(link, callback) {
		spider(link, nesting - 1, callback);
	}, callback);
}

spider(process.argv[2], 1, function(err, filename, downloaded) {
	if(err) {
		console.log(err);
	} else if(downloaded) {
		console.log('Compledted the download of"' + filename + '"');
	} else {
		console.log('"' + filename + '"was already downloaded');
	}
});