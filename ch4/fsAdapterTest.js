var levelup = require('level');
var fsAdapter = require('./fsAdapter');
var db = levelup('./fsDB', {valueEncoding: 'binary'});
var fs = fsAdapter(db);

fs.writeFile('file.txt', 'Hello!', function() {
  fs.readFile('file.txt', {encoding: 'utf8'}, function(err, res) {
    console.log(res);
  });
});

fs.readFile('missing.txt', {encoding: 'utf8'}, function(err, res) {
  console.log(err);
})
