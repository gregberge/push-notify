/**
 * Sender for c2dm protocol (Android)
 */

var C2DM = require("c2dm").C2DM;

/**
 * C2dm Sender
 */
var Sender = function()
{
   this.initialized = false;
   this.config = null;
   this.errorCallback = null;
};

/**
 * Sender initialisation
 */
Sender.prototype.initialize = function(force)
{
   if(this.initialized && !force)
   {
      return ;
   }

   console.log(new Date() + " INITIALIZATION STEP");
   console.log('>>> config ---');
   console.log(this.config);
   console.log('<<< config ---');


   this.c2dm = new C2DM(this.config);

   this.initialized = true;

};

/**
 * Callback error
 * @param string err
 * @param object message
 */
Sender.prototype._errorCallback = function(err, message)
{
   console.log(new Date() + " ERROR " + err + " : " + message.registration_id);

   if(typeof this.errorCallback === "function")
      this.errorCallback({error: err, message: message}, "c2dm");
};

/**
 * Login with username/password to retrieve an auth token
 */
Sender.prototype.login = function(callback)
{
   this.initialize();
   this.c2dm.login(callback);
};

/**
 * Send a notification
 * @param object data
 */
Sender.prototype.send = function(data, callback)
{
   this.initialize();

   var message = data;

   console.log(new Date() + " SENDING STEP : " + message.registration_id);

   var k = this;

   this.c2dm.send(message, function(err, messageId){
      if (err) {
         k._errorCallback(err, message);
      } else {
         console.log(new Date() + " SENDING STEP SUCCESS : Sent with message ID: ", messageId);
      }
   });

   callback();
};

exports.Sender = Sender;
