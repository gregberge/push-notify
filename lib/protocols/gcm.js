var GCM = require('node-gcm'),
    util = require('util'),
    Sender = require('../sender').Sender,
    Q = require('q'),
    _ = require('lodash');

var GcmSender = function () {
  Sender.apply(this, arguments);
};

util.inherits(GcmSender, Sender);

GcmSender.prototype = _.extend(GcmSender.prototype, {

  setUpConnection: function () {

    // If a connection exists, do nothing
    if (this.connection) return ;

    // Create connection
    this.connection = new GCM.Sender(this.config.key);

    // No. of retries
    this.retries = this.config.retries || 4;
  },

  send: function ( data ) {

    var self = this;

    // Set up connection
    self.setUpConnection();

    var registrationIds = data.registrationId;
    if (! Array.isArray(registrationIds))
      registrationIds = [registrationIds];

    this.connection.send(new GCM.Message(data), registrationIds, this.retries, function (err, res) {
      if (err)
        return this.emit('error', err);

      _.each(res.results, function (result, index) {

        if (result.error)
          return this.emit('transmissionError', result.error, registrationIds[index]);

        if (result.registration_id)
          this.emit('updated', result, registrationIds[index]);

        this.emit('transmitted', result, registrationIds[index]);

      }.bind(this));

    }.bind(this));
  }
});

exports.Sender = GcmSender;