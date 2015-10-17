var fs = require('fs');
var zlib = require('zlib');
var file = process.argv[2];

fs.createReadStream(file)
  .pipe(zlib.createGzip(file))
  .pipe(fs.createWriteStream(file))
  .on('finish', function(err) {
    console.log('File fully descompressed');
  });
