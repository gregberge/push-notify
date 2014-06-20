/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var util = require('util');
var mpns = require('mpns');

/**
 * Expose module.
 */

module.exports = Sender;

/**
 * Create a new MPNS sender.
 */

function Sender() {
  EventEmitter.call(this);
}

util.inherits(Sender, EventEmitter);

/**
 * Send a notification.
 *
 * @param {object} data
 * @param {string|string[]} data.pushUri Device push uri
 * @param {string} data.text1 Text of the toast (bold)
 * @param {string} data.text2 Text of the toast (normal)
 * @param {string} data.param Optional uri parameters
 */

Sender.prototype.send = function (data) {
  var sender = this;

  // pushUri can be string or array.
  if (! _.isArray(data.pushUri)) data.pushUri = [data.pushUri];

  // Prepare options.
  var options = _.omit(data, 'pushUri');

  // Send a notification for each push uri.
  _.each(data.pushUri, function sendNotification(pushUri) {
    mpns.sendToast(pushUri, options, function (err, res) {
      if (err) return sender.emit('transmissionError', err, options, pushUri);
      sender.emit('transmitted', res, options, pushUri);
    });
  });
};