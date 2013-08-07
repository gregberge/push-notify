var events = require('events'),
    util = require('util');

// Create a sender
var Sender = function (config) {
  this.config = config || {};
  events.EventEmitter.call(this);
};

// Abstract method
Sender.prototype.send = function send( data ){}

// Inherits from EventEmitter
util.inherits(Sender, events.EventEmitter);

exports.Sender = Sender;