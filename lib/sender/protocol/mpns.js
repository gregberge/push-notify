/**
 * Sender for mpns protocol (WindowsPhone)
 */

var mpns = require('mpns');

/**
 * Mpns Sender
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
Sender.prototype.initialize = function()
{
   if(this.initialized)
   {
      return ;
   }

   console.log(new Date() + " INITIALIZATION STEP");
   console.log('>>> config ---');
   console.log(this.config);
   console.log('<<< config ---');

   this.initialized = true;

};

/**
 * Callback error
 * @param string err
 * @param object message
 */
Sender.prototype._errorCallback = function(err, msg)
{
   console.log(new Date() + " ERROR " + err + " : " + msg.device_url);

   if(typeof this.errorCallback === "function")
      this.errorCallback({error: err, msg: msg}, "mpns");
};

/**
 * Send a notification
 * @param object data
 */
Sender.prototype.send = function(data, callback)
{
   this.initialize();

   var device_url = data.device_url;

   console.log(new Date() + " SENDING STEP : " + device_url);

   var message = { text1: data.text1, text2: data.text2, param: data.param };
   var toast = new mpns.toast(message);

   var k = this;

   toast.send(device_url, function(err, res) {
      if (err) {
         k._errorCallback(err, data);
      } else {
         console.log(new Date() + " SENDING STEP SUCCESS : ", res);
      }
   });

   callback();
};

exports.Sender = Sender;
