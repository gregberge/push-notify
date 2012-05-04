var Notify = require("./index").Notify,
    apnNotify;

var config = {
      "prod" : {
         "sender" : {
            "apn" : {
               "key" : "./config/prod/apn/key.pem",
               "cert" : "./config/prod/apn/cert.pem",
               "gateway" : "gateway.push.apple.com",
               "port" : 2195
            }
         }
      },
      "sandbox" : {
         "sender" : {
            "apn" : {
               "key" : "./config/sandbox/apn/key.pem",
               "cert" : "./config/sandbox/apn/cert.pem",
               "gateway" : "gateway.sandbox.push.apple.com",
               "port" : 2195
            }
         }
      }
    };

apnNotify = new Notify(Notify.PROTOCOL_APN, config.dev);
apnNotify.notify({token:"b5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32", alert:"Hello World !"}, function(){
   console.log("Sending ok");
});