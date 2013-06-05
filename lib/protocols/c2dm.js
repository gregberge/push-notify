var C2DM = require('c2dm').C2DM,
    util = require('util'),
    Sender = require('../sender').Sender,
    Q = require('q'),
    _ = require('lodash');

var C2dmSender = function () {
  Sender.apply(this, arguments);
};

util.inherits(C2dmSender, Sender);

C2dmSender.prototype = _.extend(C2dmSender.prototype, {

  setUpC2dm: function () {
    if (this.loginDeferred)
      return this.loginDeferred.promise;

    this.c2dm = new C2DM(this.config);
    this.loginDeferred = Q.defer();

    this.c2dm.login(_.bind(function (err, token) {
      if (err)
        this.loginDeferred.reject(token);
      else
        this.loginDeferred.resolve(token);
    }, this));

    return this.loginDeferred.promise;
  },

  send: function (data) {
    this.setUpC2dm().then(_.bind(function () {
      var registrationIds = data.registration_id;

      if (! _.isArray(registrationIds))
        registrationIds = [registrationIds];

      _.each(registrationIds, function (registrationId) {
        var payload = _.clone(data);
        payload.registration_id = registrationId;

        this.c2dm.send(payload, _.bind(function (err, messageId) {
          if (err)
            return this.emit('transmissionError', err, payload);

          this.emit('transmitted', messageId);
        }, this));

      }, this);

    }, this), function (error) {
      this.emit('error', error);
    });
  }
});

exports.Sender = C2dmSender;