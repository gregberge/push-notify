var Notify = require("./index").Notify,
    apnNotify;

var config = {
      "sandbox" : {
            "sender" : {
                  "c2dm" : {
                        user: "<email>",
                        password: "<password>",
                        source: "<source>",
                        keepAlive: true
                  }
            }
      }
};


apnNotify = new Notify(Notify.PROTOCOL_C2DM, config.sandbox);
apnNotify.setErrorCallback(function(data) {
   console.log(data);
});

var message = JSON.parse("{\"registration_id\":\"MY_REGISTRATION_ID_HERE\",\"collapse_key\":1339425624.9469,\"data.sequence\":\"Politique\",\"data.titre\":\"Fran\\u00e7ois Hollande promet de r\\u00e9former le syst\\u00e8me bancaire\",\"data.texte\":\"La candidat socialiste, qui tenait son premier grand meeting au Bourget (Seine-saint-Denis), a promis, s'il \\u00e9tait \\u00e9lu, le vote d'une loi sur les banques \\\"qui les obligera \\u00e0 s\\u00e9parer leurs activit\\u00e9s de cr\\u00e9dit et de sp\\u00e9culation\\\". Il a \\u00e9galement promis d'inscrire la loi de 1905 sur la la\\u00efcit\\u00e9 dans la Constitution et de baisser le salaire du pr\\u00e9sident et des ministres de 30 %. \"}");


apnNotify.notify(message, function() {
   console.log("Sending ok");
});

// Update-Client-Auth: http://android-developers.blogspot.fr/2012/04/android-c2dm-client-login-key.html
