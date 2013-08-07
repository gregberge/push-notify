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
    if (this.connection)
      return ;

    // Create connection
    this.connection = new GCM.sender( this.config.key );

  },

  send: function ( data ) {
    
    // Set up connection
    this.setUpConnection();

    var tokens = data.registration_id;
    if (! _.isArray(tokens))
      tokens = [tokens];

    // Create message
    var message = new gcm.Message( data );

    // Send notification
    var payload;
    _.each(tokens, function( registrationId ){
      
      payload = _.clone(data);
      payload.registration_id = registrationId;

      sender.send(message, registrationId, 2, 
        _.bind(function (err, result) {
          if (err)
            return this.emit('transmissionError', err, payload);

          this.emit('transmitted', result, payload);
        }, this) );

    });
    
  }

});

exports.Sender = GcmSender;