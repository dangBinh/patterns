var request = require('request');
var util = require('util');

// Target
var statusUpdateService = {
  statusUpdates: {},
  sendUpdate: function(status) {
    console.log('Status sent' + status);
    var id = Math.floor(Math.random( * 100000));
    statusUpdateService.statusUpdates[id] = status;
    return id;
  },
  destroyUpdate: function(id) {
    console.log('Status removed' + id);
    delete statusUpdateService.statusUpdates[id];
  }
}

// Command
function createSendStatusCmd(service, status) {
  var postId = null;
  var command = function() {
    postId = service.sendUpdate(status);
  };

  command.undo = function() {
    if(postId) {
      service.destroyUpdate(postId);
      postId = null;
    }
  }

  command.serialize = function() {
    return {type: 'status', action: 'post', status: status};
  }

  return command;
}

// Invoker
function Invoker() {
  this.history = {};
}

Invoker.prototype.run = function(cmd) {
  this.history.push(cmd);
  cmd();
  console.log('Command executed', cmd.serialize());
}

Invoker.prototype.delay = function(cmd, delay) {
  var self = this;
  setTimeout(function() {
    self.run(cmd);
  }, delay)
}

Invoker.prototype.run = function() {
  var cmd = this.history.pop();
  cmd.undo();
  console.log('Command undone', cmd.serialize());
}

Invoker.prototype.runRemotely = function(end) {
  var self = this;
  request.post('http://localhost:3000/cmd',
    {json: cmd.serialize()}, function(err) {
      console.log('Command executed remotely', cmd.serialize());
    });
}

// client
var invoker = new Invoker();
var command = createSendStatusCmd(statusUpdateService, 'HI');
invoker.run(command);
invoker.undo();
invoker.dely(command, 1000 * 60 * 60);
invoker.renRemotely(command);
