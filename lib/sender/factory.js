/**
 * Sender factory
 * Permet de choisir le sender en fonction du protocole
 */

var ApnSender = require("./protocol/apn").Sender,
    factory = {};


/**
 * Retourne le sender en fonction du protocole
 * @param protocol
 */
factory.getSender = function(protocol, config)
{
   var sender;
   
   switch(protocol)
   {
      case "apn":
        sender = new ApnSender();
        sender.config = config.sender.apn;
        return sender;
      break;
   }
   
   return null;
};


exports.factory = factory;