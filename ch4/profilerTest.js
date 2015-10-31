var Profiler = require('./profiler');

function generateRandomArray(len) {
  var p = Profiler('Generate random array');
  p.start();
  var arr = [];
  for(var i = 0; i < len; i++) {
    arr.push(Math.random());
  }
  p.end();
}

generateRandomArray(1e6);
console.log('Done');
