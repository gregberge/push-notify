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
 * Close all connections.
 *
 * @param {function} cb
 */

Sender.prototype.close = function (cb) {
  if (! this.connection) {
    if (cb) process.nextTick(cb);
    return ;
  }

  this.connection.shutdown();
  // node-apn use a delay of 2500ms before really closing the connection
  // https://github.com/argon/node-apn/blob/3731fae9fefccdb7964606d819561058debf4b70/lib/connection.js#L355
  if (cb) setTimeout(cb, 2600);
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