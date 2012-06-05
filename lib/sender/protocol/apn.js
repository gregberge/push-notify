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
   this.errorCallback = null;
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
         errorCallback: this._errorCallback.bind(this),
         cacheLength: 1000,
         enhanced : true 
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
   this.connection.initialize();
};

/**
 * Callback error
 * @param int errorCode
 * @param object notification
 */
Sender.prototype._errorCallback = function(errorCode, notification)
{
   console.log(new Date() +  " ERROR " + errorCode + " : " + notification.device.token.toString('hex'));
   
   if(typeof this.errorCallback === "function")
      this.errorCallback.call(this, notification, 'apn');
};


/**
 * Envoi d'une notification
 * @param object data
 */
Sender.prototype.send = function(data, callback)
{
   this.initialize();
   
   var notification = new apns.Notification(), device = new apns.Device(data.token);
   
   // no alert
   //delete data.sound;
   //data.alert = "";
   
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
   
   notification.expiry = ~~(new Date().getTime() / 1000 + 0.5) + 600;
   
   console.log(new Date() +  " SEND_ORDER : " + data.token);
   
   this.connection.sendNotification(notification);
   
   callback();
};

exports.Sender = Sender;