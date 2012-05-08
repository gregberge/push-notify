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


apnNotify = new Notify(Notify.PROTOCOL_APN, config.prod);
apnNotify.notify({token:"c5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32", alert:"Hello World !", sound: "dong.caf"}, function(){
   console.log("Sending ok");
});

apnNotify.notify({token:"b5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32", alert:"Hello World !", sound: "dong.caf"}, function(){
   console.log("Sending ok");
});


//Ismael
/*
apnNotify.notify({token:"11e8aa0d9dff284080fb084587d65584fe1d409451345d492da705d201644fa8", alert:"Au lit !", sound: "dong.caf"}, function(){
   console.log("Sending ok");
});
*/

//OG
/*
apnNotify.notify({token:"25fea36823901ad36e17911af59c23f973c0759d0198a3187cbc371ace1082df", alert:"Au lit !", sound: "dong.caf"}, function(){
   console.log("Sending ok");
});
*/

//Potocki
/*
apnNotify.notify({token:"0c5cd96a319c3ac21c0341e97c493394706c9793d4e6c66a638d432b487dc64f", alert:"", sound: "dong.caf"}, function(){
   console.log("Sending ok");
});
*/