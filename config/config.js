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

var config = null;

if(typeof process.env.NOTIFY_ENVIRONMENT !== "undefined")
{
   config = configData[process.env.NOTIFY_ENVIRONMENT];
}

exports.config = config;