/**
 * Sender factory
 * Permet de choisir le sender en fonction du protocole
 */

var apnSender = require("./protocol/apn").sender,
    factory = {};


/**
 * Retourne le sender en fonction du protocole
 * @param protocol
 */
factory.getSender = function(protocol, config)
{
   switch(protocol)
   {
      case "apn":
        apnSender.config = config.sender.apn;
        return apnSender;
      break;
   }
   
   return null;
};


exports.factory = factory;