var apn = require('apn'),
    _ = require('lodash'),
    util = require('util'),
    Sender = require('../sender').Sender;

var ApnSender = function () {
  Sender.apply(this, arguments);
};

util.inherits(ApnSender, Sender);

// Extend prototype
ApnSender.prototype = _.extend(ApnSender.prototype, {

  // Set up the connection
  setUpConnection: function () {
    // If a connection exists, do nothing
    if (this.connection)
      return ;

    // Create connection
    this.connection = new apn.Connection(this.config);

    // Proxy all events
    _.each(['error', 'socketError', 'transmitted', 'cacheTooSmall', 'connected', 'disconnected', 'timeout', 'transmissionError'], function (event) {
      this.connection.on(event, _.bind(function () {
        this.emit.apply(this, [event].concat([].slice.call(arguments)));
      }, this));
    }, this);
  },

  // Send a notification
  send: function (data) {
    // Set up connection
    this.setUpConnection();

    var tokens = data.token;

    // Create devices
    if (! _.isArray(tokens))
      tokens = [tokens];

    var devices = _.map(tokens, function (token) {
      return new apn.Device(token);
    }),
    note = new apn.Notification();

    // Configure notification
    _.extend(note, data);

    // Send notification
    this.connection.pushNotification(note, devices);
  }
});

exports.Sender = ApnSender;