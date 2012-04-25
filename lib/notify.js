var senderFactory = require('./sender/factory').factory,
    deferred = require('deferred');

var Notify = function(protocol)
{
   this.sender = senderFactory.getSender(protocol);
};

Notify.prototype.notify = function(data, callback)
{
   var notificationData = JSON.parse(data);
   
   this.sender.send(notificationData).then(function()
   {
      d.resolve();
      callback();
   });
   
   return d.promise;
};

Notify.PROTOCOL_APN = 'apn';

exports.Notify = Notify;