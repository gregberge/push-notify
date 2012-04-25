var senderFactory = require('./sender/factory').factory,
    deferred = require('deferred');

var Notify = function(identifier)
{
   this.identifier = identifier;
};

Notify.prototype.notify = function(data, callback)
{
   var notificationData = JSON.parse(data);
   
   console.log(notificationData);
   
   /*
   sender.send(notificationData).then(function()
   {
      d.resolve();
      callback();
   });
   */
   
   return d.promise;
};

Notify.PROTOCOL_APN = 'apn';

exports.Notify = Notify;