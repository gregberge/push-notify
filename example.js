var Notify = require("./index").Notify,
    apnNotify;

var config = {
      "dev" : {
         "sender" : {
            "apn" : {
               "key" : "./config/dev/apn/key.pem",
               "cert" : "./config/dev/apn/cert.pem",
               "gateway" : "gateway.push.apple.com",
               "port" : 2195
            }
         }
      }
    };

apnNotify = new Notify(Notify.PROTOCOL_APN, config.dev);
apnNotify.notify({token:"b5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32", alert:"Hello World !"})
.done(function(){
   console.log("envoi ok");
});