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
    this.connection = new GCM.Sender( this.config.key );

    // No. of retries
    this.retries = 4;
    if ( this.config.retries )
      this.retries = this.config.retries;

  },

  send: function ( data ) {
    
    var self = this;
    // Set up connection
    self.setUpConnection();

    var tokens = data.registration_id;
    if (! _.isArray(tokens))
      tokens = [tokens];

    // Create message
    var message = new GCM.Message( data );

    // Send notification
    var payload, error;
    _.each(tokens, function( registrationId ){
      
      payload = _.clone(data);
      payload.registration_id = registrationId;

      self.connection.send(message, [registrationId], self.retries, 
        _.bind(function (err, result) {

          payload.server_result = result;
          if ( result && result.success  )
            return this.emit('transmitted', payload );
          
          error = null;
          if ( result && result.results && result.results.length > 0 && result.results[0].error )
            error = result.results[0].error;

          return this.emit('transmissionError', error, payload );

          
        }, self) );

    });
    
  }

});

exports.Sender = GcmSender;