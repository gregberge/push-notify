var notify = {};

['apn'].forEach(function (protocol) {
  notify[protocol] = require('./protocols/' + protocol);
});

module.exports = notify;