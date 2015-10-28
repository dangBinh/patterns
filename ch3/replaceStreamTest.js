var ReplaceStream = require('./replaceStream');

var replaceStream = new ReplaceStream('World', 'Node.js');

replaceStream.on('data', function(chunk) {
  console.log(chunk);
});

replaceStream.write('Hello W');
replaceStream.write('orld!');
replaceStream.end();
