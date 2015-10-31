var level = require('level');
var db = level(__dirname + '/db', {valueEncoding: 'json'});

var levelSubscribe = require('./levelSubscribe');
db = levelSubscribe(db);
db.subscribe({doctype: 'tweet', language: 'en'},
  function(k, val){
    console.log(val);
  });
db.put('1', {doctype: 'tweet', text: 'Hi', language: 'en'});
db.put('2', {doctype: 'company', name: 'ACME Co.'});
