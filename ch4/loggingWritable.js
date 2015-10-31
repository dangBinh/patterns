// Library
var fs = require('fs');
var writable = fs.createWriteStream('lorem.text');
var writableProxy = createLogginWritable(writable);
// Proxy

function createLogginWritable(writeableOrig) {

  var proto = Object.getPrototypeOf(writeableOrig);

  function LogginWritable(writableOrig) {
    this.writableOrig = writableOrig;
  }
  LogginWritable.prototype = Object.create(proto);

  LogginWritable.prototype._write = function(chunk, encoding, callback) {
    if(!callback && typeof encoding == 'function') {
      callback = encoding;
      encoding = undefined;
    }
    console.log('Writing' + chunk);
    return this.writableOrig._write(chunk, encoding, function() {
      console.log('Finished writing', chunk);
      callback && callback();
    })
  }

  LogginWritable.prototype.on = function() {
    return this.writableOrig.on.apply(this.writableOrig, arguments);
  }

  LogginWritable.prototype.end = function() {
    return this.writableOrig.end.apply(this.writableOrig, arguments);
  }

  return new LogginWritable(writableOrig);
}

// Write
writableProxy.write('First chunk', 'utf8');
writableProxy.write('this is not logged');
writable.write('This is not logged');
writableProxy.end();
