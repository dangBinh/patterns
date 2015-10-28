var through = require('through2');
var fromArray = require('from2-array');
var fs = require('fs');

function concatFiles(destination, files, callback) {
  var destStream = fs.createWriteStream(destination);

  fromArray.obj(files)
          .pipe(through.obj(function(file, encoding, done) {
            var src = fs.createReadStream(file);

            src.pipe(destStream, {end: false});
            src.on('end', function() {
              done(); // trigger to next file
            })
          }))
          .on('finish', function() {
            destStream.end();
            callback();
          });
}

module.exports = concatFiles;
