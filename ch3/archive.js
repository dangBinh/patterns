var combine = require('multipipe');
var fs = require('fs');

var compressAndEncryptStream = require('./combinedStreams').compressAndEncrypt;

combine(
  fs.createReadStream(process.argv[3]),
  compressAndEncryptStream(process.argv[2]),
  fs.createWriteStream(process.argv[3] + ".gz.aes")
).on('error', function(err) {
  console.log(err);
})
