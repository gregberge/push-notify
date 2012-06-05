var senderFactory = require('./sender/factory').factory;

var Notify = function(protocol, config)
{
   this.sender = senderFactory.getSender(protocol, config);
};

Notify.prototype.initialize = function()
{
   this.sender.initialize(); 
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

exports.Notify = Notify;