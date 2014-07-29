/**
 * Expose each protocols.
 */

['mpns', 'apn', 'gcm', 'c2dm', 'wns'].forEach(function (protocol) {

  /**
   * Create a new sender.
   *
   * @param {object} options
   */

  exports[protocol] = function createSender(options) {
    var Sender = require('./protocols/' + protocol);
    return new Sender(options);
  };
});
