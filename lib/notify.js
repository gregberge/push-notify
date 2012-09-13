var senderFactory = require('./sender/factory').factory;

var Notify = function(protocol, config)
{
   this.sender = senderFactory.getSender(protocol, config);
};

Notify.prototype.getSender = function()
{
   return this.sender;
};

Notify.prototype.setErrorCallback = function(callback)
{
   this.sender.errorCallback = callback;
};

Notify.prototype.notify = function(data, callback)
{
   return this.sender.send(data, callback);
};

Notify.PROTOCOL_APN = 'apn';
Notify.PROTOCOL_C2DM = 'c2dm';
Notify.PROTOCOL_MPNS = 'mpns';

exports.Notify = Notify;
