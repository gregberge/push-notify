var apn = require('apn'),
    _ = require('lodash'),
    events = require('events'),
    util = require('util');

var Sender = function (config) {
  this.config = config;
  events.EventEmitter.call(this);
};

util.inherits(Sender, events.EventEmitter);

Sender.prototype = _.extend(Sender.prototype, {
  setUpConnection: function () {
    if (this.connection)
      return ;

    this.connection = new apn.Connection(this.config);

    if (this.config.errorCallback)
      this.connection.on('transmissionError', this.config.errorCallback);

    _.each(['error', 'socketError', 'transmitted', 'cacheTooSmall', 'connected', 'disconnected', 'timeout', 'transmissionError'], function (event) {
      this.connection.on(event, _.bind(function () {
        this.emit.apply(this, _.union([event], arguments));
      }, this));
    }, this);
  },

  send: function (data, done) {
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

    if (done)
      done();
  }
});

exports.Sender = Sender;