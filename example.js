var Notify = require("./index").Notify,
    apnNotify;

apnNotify = new Notify(Notify.PROTOCOL_APN);
apnNotify.notify({token:"b5bf61a839855b92a394dc883433df64447a7fe7ed0d8ee121f97c9973628f32", alert:"Hello World !"})
.then(function(){
   console.log("envoi ok");
});