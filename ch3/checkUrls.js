var fs = require('fs');
var split = require('split');
var request = require('request');
var ParallelStream = new require('./parallelStream');

fs.createReadStream(process.argv[2])
  .pipe(split())
  .pipe(ParallelStream(function() {

  }))
  .pipe(fs.createWriteStream('results.txt'))
  .on('finish', function() {
    console.log('All urls were checked');
  });
