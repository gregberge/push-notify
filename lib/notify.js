var senderFactory = require('./sender/factory').factory,
    deferred = require('deferred');

var Notify = function(protocol)
{
   this.sender = senderFactory.getSender(protocol);
};

Notify.prototype.notify = function(data)
{
   var d = deferred();
   
   this.sender.send(data).then(function()
   {
      d.resolve();
   });
   
   return d.promise;
};

Notify.PROTOCOL_APN = 'apn';

exports.Notify = Notify;