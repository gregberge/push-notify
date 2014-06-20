/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var pipeEvent = require('pipe-event');
var _ = require('lodash');
var apn = require('apn');

/**
 * Expose module.
 */

module.exports = Sender;

/**
 * Create a new APN sender.
 *
 * @param {object} options
 * @see https://github.com/argon/node-apn
 */

function Sender(options) {
  EventEmitter.call(this);
  this.options = options || {};
}

util.inherits(Sender, EventEmitter);

/**
 * Send a notification.
 *
 * @param {object} data Avalaible parameters can be found at
 * https://github.com/argon/node-apn/blob/master/doc/apn.markdown
 * @param {function} cb
 */

Sender.prototype.send = function (data) {
  // Create a new APN connection.
  this.connection = this.connection || this.createConnection();

  // Token can be string or array.
  if (! _.isArray(data.token)) data.token = [data.token];

  // Create notification.
  var notification = new apn.Notification();
  _.merge(notification, _.omit(data, 'token'));

  // Push notification.
  this.connection.pushNotification(notification, data.token);
};

/**
 * Create a new APN connection and proxify events.
 *
 * @returns {apn.Connection}
 */

Sender.prototype.createConnection = function () {
  var connection = new apn.Connection(this.options);

  pipeEvent([
    'error',
    'socketError',
    'transmitted',
    'cacheTooSmall',
    'connected',
    'disconnected',
    'timeout',
    'transmissionError'
  ], connection, this);

  return connection;
};