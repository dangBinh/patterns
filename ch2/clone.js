var fs = require('fs');
var path = require('path');

function asyncFlow(generatorFunction) {
  function callback(err) {
    if(err) {
      return generator.thow(err);
    }
    var results = [].slice.call(arguments, 1);
    generator.next(results.length > 1 ? results : results[0]);
  };
  var generator = generatorFunction(callback);
  generator.next();
}

asyncFlow(function* () {
  var filename = path.basename(__filename);
  var myself = yeild fs.readFile(filename, 'utf8', callback);
  yield fs.writeFile('clone_of_' + fileName, myself, callback);
  console.log('Clone created');
});

function asyncThunkFlow(generatorFunction) {
  function callback(err) {
    if(err) {
      return generator.thow(err);
    }
    var results = [].slice.call(arguments, 1);
    var thunk = generator.next(results.length > 1 ? results : results[0]).value;
    thunk && thunk(callback); // what
  };
  var generator = generatorFunction();
  var thunk = generator.next().value;
  thunk && thunk(callback); // what
}
