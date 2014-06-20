/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var c2dm = require('c2dm');
var _ = require('lodash');
var Promise = require('bluebird');

/**
 * Expose module.
 */

module.exports = Sender;

/**
 * Create a new C2DM sender.
 *
 * @param {object} options
 * @param {string} options.user
 * @param {string} options.password
 * @param {string} options.source
 * @see https://github.com/SpeCT/node-c2dm
 */

function Sender(options) {
  EventEmitter.call(this);
  this.options = options;
}

util.inherits(Sender, EventEmitter);

/**
 * Send a notification.
 *
 * @param {object} data
 * @see https://github.com/SpeCT/node-c2dm#send-message-to-device
 */

Sender.prototype.send = function (data) {
  var sender = this;

  // registration_id can be string or array.
  if (! _.isArray(data.registration_id)) data.registration_id = [data.registration_id];

  data.registration_id.forEach(function (registrationId) {
    var payload = _.extend(_.clone(data), {registration_id: registrationId});

    sender.login()
    .then(function sendNotification() {
      sender.c2dm.send(payload, function (err, messageId) {
        if (err) return sender.emit('transmissionError', err, payload, registrationId);
        sender.emit('transmitted', messageId, payload, registrationId);
      });
    })
    .catch(function handleError(err) {
      sender.emit('transmissionError', err, payload, registrationId);
    });
  });
};

/**
 * Create a new C2DM sender and login.
 *
 * @returns {C2DM}
 */

Sender.prototype.login = function () {
  var sender = this;

  if (! sender.c2dm) {
    sender.c2dm = new c2dm.C2DM(sender.options);
    sender.c2dm.setMaxListeners(15);
    sender.loginPromise = Promise.promisify(sender.c2dm.login)()
    .catch(function (err) {
      sender.emit('error', err);
      throw err;
    });
  }

  return sender.loginPromise;
};