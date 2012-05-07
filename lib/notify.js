var senderFactory = require('./sender/factory').factory;

var Notify = function(protocol, config)
{
   this.sender = senderFactory.getSender(protocol, config);
};

Notify.prototype.initialize = function()
{
   this.sender.initialize(); 
};

Notify.prototype.notify = function(data)
{
   return this.sender.send(data);
};

Notify.PROTOCOL_APN = 'apn';

exports.Notify = Notify;