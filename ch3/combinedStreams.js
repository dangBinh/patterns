var fs = require('fs');
var combine = require('multipipe');
var crypto = require('crypto');
var zlib = require('zlib');

module.exports.compressAndEncrypt = function(password) {
  return combine(
    zlib.createGzip(),
    crypto.createCipher('aes192', password)
  )
}

module.exports.decryptAndDecompress = function(password) {
  return combine(
    crypto.createCipher('aes192', password),
    zlib.createGunzip()
  )
}
