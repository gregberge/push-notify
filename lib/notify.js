var senderFactory = require('./sender/factory').factory;

var Notify = function(protocol, config)
{
   this.sender = senderFactory.getSender(protocol, config);
};

Notify.prototype.notify = function(data, callback)
{
   return this.sender.send(data, callback);
};

Notify.PROTOCOL_APN = 'apn';

exports.Notify = Notify;