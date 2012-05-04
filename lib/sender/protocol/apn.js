/**
 * Sender pour le protocole apn (iDevices)
 */

var apns = require("apn");

/**
 * Apn Sender
 */
var Sender = function()
{
   this.connection = null;
   this.initialized = false;
   this.config = null;
   this.connectionOptions = {};
};

/**
 * Initialisation du sender
 */
Sender.prototype.initialize = function()
{
   if(this.initialized)
   {
      return ;
   }
   
   this.connectionOptions = {
         cert: this.config.cert,
         key:  this.config.key,
         gateway: this.config.gateway,
         port: this.config.port,
         errorCallback: this.errorCallback.bind(this),
         cacheLength: 1000
   };

   this.connect();
   
   this.initialized = true; 
};

/**
 * Connect
 */
Sender.prototype.connect = function()
{
   this.connection = new apns.Connection(this.connectionOptions);
};

/**
 * Callback error
 * @param int errorCode
 * @param object notification
 */
Sender.prototype.errorCallback = function(errorCode, notification)
{
   console.log("Erreur " + errorCode + " survenue sur la notification : ");
   console.log(notification);
};


/**
 * Envoi d'une notification
 * @param object data
 */
Sender.prototype.send = function(data, callback)
{
   this.initialize();
   
   var notification = new apns.Notification(), device = new apns.Device(data.token);
   
   if(typeof data.badge !== "undefined" && data.badge)
   {
      notification.badge = data.badge;
   }
   
   if(typeof data.sound !== "undefined" && data.sound)
   {
      notification.sound = data.sound;
   }
   
   if(typeof data.alert !== "undefined" && data.alert)
   {
      notification.alert = data.alert;
   }
   
   if(typeof data.payload !== "undefined" && data.payload)
   {
      notification.payload = data.payload;
   }
   
   notification.device = device;
   
   console.log(new Date() +  " TOKEN " + data.token);
   
   var error = this.connection.sendNotification(notification);
   
   if(typeof error !== "undefined")
   {
      console.log("Error " + error + " append on " + data.token);
   }
   
   if(typeof callback === "function")
   {
      callback();
   }
};

exports.Sender = Sender;