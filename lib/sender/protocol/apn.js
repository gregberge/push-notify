/**
 * Sender pour le protocole apn (iDevices)
 */

var apns = require("apn"),
    sender = {};

/**
 * Nombre maxi de notifications par connexion
 */
sender.MAX_NOTIF_BY_CONNECTION = 200;

/**
 * Connexion apn
 */
sender.connection = null;

/**
 * Initialisé
 */
sender.initialized = false;

/**
 * Configuration
 */
sender.config = null;

/**
 * Nombre de notifications envoyées
 */
sender.count = 0;

/**
 * Options de connexion
 */
sender.connectionOptions = {};

/**
 * Initialisation du sender
 */
sender.initialize = function()
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
         errorCallback: this.errorCallback.bind(this)
   };

   this.connect();
   
   this.initialized = true; 
};

/**
 * Connect
 */
sender.connect = function()
{
   this.connection = new apns.Connection(this.connectionOptions);
};

/**
 * Garder la connexion en vie
 */
sender.keepAliveConnection = function()
{
   if(this.count >= this.MAX_NOTIF_BY_CONNECTION)
   {
      this.connect();
      this.count = 0;
   }
};

/**
 * Callback error
 * @param int errorCode
 * @param object notification
 */
sender.errorCallback = function(errorCode, notification)
{
   console.log("Erreur " + errorCode + " survenue sur la notification : ");
   console.log(notification);
};


/**
 * Envoi d'une notification
 * @param object data
 */
sender.send = function(data, callback)
{
   this.initialize();
   this.keepAliveConnection();
   
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
   
   this.count++;
   
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

exports.sender = sender;