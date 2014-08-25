/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var wns = require('wns');
var _ = require('lodash');

/**
 * Expose module.
 */

module.exports = Sender;

//required properties to send a notification
var required = ['client_id', 'client_secret', 'channelURI', 'type', 'payload'];

//valid notification type
var validTypes = ['toast', 'badge', 'raw', 'tile'];

/**
 * Create a new WNS sender.
 *
 * @param {object} options
 * @param {string} options.client_id
 * @param {number} options.client_secret
 */

function Sender(options) {
  EventEmitter.call(this);
  _.extend(this, options || {});
}

util.inherits(Sender, EventEmitter);

/**
 * Send a notification.
 *
 * @param {string} data.channelURI
 * @param {string} data.payload
 * @param {string} data.type
 * @param {object} data.options
 */

Sender.prototype.send = function (data) {
  var sender = this;

  data = sanitize(sender, data);

  //check that all required pros are present
  if (! _.isEmpty(getMissingProps(data)))
    return sendRequiredErrors(sender, getMissingProps(data));

  //check that notif type is valid
  if (! _.contains(validTypes, data.type))
    return sender.emit('error', 'type should be one of: toast, badge, raw, tile');

  //create send options
  var options = _.defaults({
    client_id: data.client_id,
    client_secret: data.client_secret
  }, data.options);

  //send
  wns.send(data.channelURI, data.payload, 'wns/' + data.type, options,
  //called once done of is there was a transmission error
  function (err, res) {
    if (err) return sender.emit('transmissionError', err, data.channelURI);
    sender.emit('transmitted', res, data.channelURI);
  });
};


/**
 * merge send data with authorization data,
 * remove all undefined values
 */
function sanitize(sender, data) {
  data = _.defaults({}, {
    client_id: sender.client_id, client_secret: sender.client_secret
  }, data);

  return _.reduce(data, function (acc, value, key) {
    if (! _.isUndefined(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

/**
 * return an array containing all the missing required
 * properties
 */
function getMissingProps(data) {
  var containsKey = _.partial(_.contains, _.keys(data));
  return _.filter(required, function (req) {
    return !containsKey(req);
  });
}

/**
 * send an error for each missing properties
 */
function sendRequiredErrors(sender, missingProps) {
  _.forEach(missingProps, function (prop) {
    sender.emit('error', prop + ' is missing');
  });
}
