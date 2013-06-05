var mpns = require('mpns'),
    _ = require('lodash'),
    Sender = require('../sender').Sender;

// Extend prototype
Sender.prototype = _.extend(Sender.prototype, {
  send: function (data) {
    var pushUris = data.pushUri;

    delete data.pushUri;

    var options = _.extend(this.config, data);

    if (! _.isArray(pushUris))
      pushUris = [pushUris];

    _.each(pushUris, function (pushUri) {
      mpns.sendToast(pushUri, options, _.bind(function (error, result) {
        if (error)
          return this.emit('transmissionError', error, pushUri);

        this.emit('transmitted', result);
      }, this));
    }, this);
  }
});

exports.Sender = Sender;