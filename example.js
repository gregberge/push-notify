var Notify = require("./index").Notify,
    notifyConfig = require("./index").config,
    apnNotify;

var configData = {
      "dev" : {
         "sender" : {
            "apn" : {
               "key" : "./config/dev/apn/key.pem",
               "cert" : "./config/dev/apn/cert.pem",
               "gateway" : "gateway.push.apple.com",
               "port" : 2195
            }
         }
      },
      
      "prod" : {
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

notifyConfig.load(configData);

apnNotify = new Notify(Notify.PROTOCOL_APN);
apnNotify.notify({token:"b5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32", alert:"Hello World !"})
.then(function(){
   console.log("envoi ok");
});