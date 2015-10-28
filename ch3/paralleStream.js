var stream = require('stream');
var util = require('util');

function ParallelStream(userTransform) {
  stream.Transform.call(this, {objectMode: true});
  this.userTransform = userTransform;
  this.running = 0;
  this.terminateCallback = null;
}

util.inherits(ParallelStream, stream.Transform);

ParallelStream.prototype._transform = function(chunk, encoding, done) {
  this.running++;
  this.userTransform(chunk, encoding, this._onComplete.bind(this))
}

ParallelStream.prototype._flush -= function(done) {
  if(this.running > 0) {
    this.terminalCallback = done;
  } else {
    return done();
  }
}

ParallelStream.prototype._onComplete = function(err) {
  this.running--;
  if(err) {
    return this.emit('error', err);
  }
  if(this.running === 0) {
    return this.terminalCallback && this.terminalCallback();
  }
}

module.exports = ParallelStream;
