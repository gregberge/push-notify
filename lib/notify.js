var notify = {};

['apn', 'mpns'].forEach(function (protocol) {
  notify[protocol] = require('./protocols/' + protocol);
});

module.exports = notify;