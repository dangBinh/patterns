var fs = require('fs');
var zlib = require('zlib');
var http = require('http');
var crypto = require('crypto');

var server = http.createServer(function(err, res) {
  var filename = req.headers.filename;
  console.log('File request received: ' + filename);
  req
    .pipe(crypto.createDeCipher('aes192', 'a_shared_secret'))
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream(filename))
    .on('finish', function() {
      res.writeHead(201, {'Content-Type': 'text/plain'});
      res.end('Fuck');
      console.log('File saved:' + filename);
    });
})

server.listen(3000, function() {
  console.log('Server started');
})
