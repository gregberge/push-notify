var notify = {};

['apn', 'mpns', 'c2dm'].forEach(function (protocol) {
  notify[protocol] = require('./protocols/' + protocol);
});

module.exports = notify;