if(typeof process.env.NOTIFY_ENVIRONMENT === "undefined")
{
   process.env.NOTIFY_ENVIRONMENT = "dev";
}

exports.Notify = require("./lib/notify").Notify;