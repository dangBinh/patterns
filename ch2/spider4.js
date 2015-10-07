var request = require('request');
var mkdirp = require('mkdirp');
var path = require('path');
var utilities = require('./utilities');
var fs = require('fs');

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
	request(url, function(err, response, body) {
		if (err) {
			return callback(err)
		}
		saveFile(filename, body, function(err) {
			if (err) {
				return callback(err);
			}
			callback(null, body);
		}); 
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

	var completed = 0, errored = false;
	links.forEach(function(link) {
		downloadQueue.pushTask(function(done) {
			spider(link ,nesting - 1, function(err) {
				if(err) {
					errored = true;
					return callback(err);
				}
				if(++completed == links.length && !errored) {
					callback();
				}
				done();
			});
		});
	});
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