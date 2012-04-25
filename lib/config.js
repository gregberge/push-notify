var config = {};
config.current = {};
config.data = {};

var load = function(data)
{
   config.data = data;
   
   if(typeof process.env.NOTIFY_ENVIRONMENT !== "undefined")
   {
      config.current = config.data[process.env.NOTIFY_ENVIRONMENT];
   }
};

exports.config = config;
exports.load = load;