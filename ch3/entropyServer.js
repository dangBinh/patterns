var chance = require('chance').Chance();

require('http').createServer(function(req, res) {
  res.writeHead(200, 'Content-Type: text/plain');
  function generateMore() {
    while(chance.bool({likelihood: 95})) {
      var shouldCountinue = res.write(chance.string({length: (16 * 1024) - 1}) + '\n');
    }
    if(!shouldCountinue) {
      console.log('Back-pressure');
      return res.once('drain', generateMore);
    }
  }
  res.end('\nThe end...\n', function() {
    console.log('All data was sent');
  });

  generateMore();
}).listen(8080, function() {
  console.log('Listening');
});
