var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var wns = require('wns');
var notify = require('../../../');

describe('WNS', function () {
  var wnsSender, sendStub;

  beforeEach(function () {
    wnsSender = notify.wns({
      client_id: 'foo',
      client_secret: 'bar'
    });

    sendStub = sinon.stub(wns, 'send');
  });

  afterEach(function () {
    wns.send.restore();
  });

  describe('#send', function () {
    it('should create a notification and send it', function () {
      wnsSender.send({
        channelURI: 'URI',
        payload: 'XML',
        type: 'badge'
      });

      expect(wns.send).to.be.calledWith('URI', 'XML', 'wns/badge', {
        client_id: 'foo',
        client_secret: 'bar'
      });
    });

    it('should create a notification with options and send it', function () {
      wnsSender.send({
        channelURI: 'URI',
        payload: 'XML',
        type: 'raw',
        options: {
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        }
      });

      expect(wns.send).to.be.calledWith('URI', 'XML', 'wns/raw', {
        client_id: 'foo',
        client_secret: 'bar',
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });

    });

    it('should emit an error for each missing required property', function () {
      var sender = notify.wns({
      });
      var errorSpy = sinon.spy();

      sender.on('error', errorSpy);

      sender.send();
      expect(errorSpy).to.be.calledWith('channelURI is missing');
      expect(errorSpy).to.be.calledWith('client_secret is missing');
      expect(errorSpy).to.be.calledWith('client_id is missing');
      expect(errorSpy).to.be.calledWith('type is missing');
      expect(errorSpy).to.be.calledWith('payload is missing');
    });

    it('should emit an error if the notif type don\'t exist', function () {
      var errorSpy = sinon.spy();
      wnsSender.on('error', errorSpy);

      wnsSender.send({
        channelURI: 'URI',
        payload: 'XML',
        type: 'wrong'
      });

      expect(errorSpy).to.be.calledWith('type should be one of: toast, badge, raw, tile');
    });

    it('should forward "transmissionError" event correctly', function () {

      sendStub.callsArgWith(4, 'error');
      var transmissionErrorSpy = sinon.spy();
      var transmittedSpy = sinon.spy();
      var errorSpy = sinon.spy();
      wnsSender.on('transmissionError', transmissionErrorSpy);
      wnsSender.on('transmitted', transmittedSpy);
      wnsSender.on('error', errorSpy);

      wnsSender.send({
        channelURI: 'URI',
        payload: 'XML',
        type: 'badge'
      });

      expect(transmissionErrorSpy).to.have.been.calledWith('error', 'URI');
      expect(transmittedSpy).to.not.be.called;
      expect(errorSpy).to.not.be.called;
    });

    it('should forward "transmitted" event correctly', function () {

      sendStub.callsArgWith(4, null, 'success');
      var transmissionErrorSpy = sinon.spy();
      var transmittedSpy = sinon.spy();
      var errorSpy = sinon.spy();
      wnsSender.on('transmissionError', transmissionErrorSpy);
      wnsSender.on('transmitted', transmittedSpy);
      wnsSender.on('error', errorSpy);

      wnsSender.send({
        channelURI: 'URI',
        payload: 'XML',
        type: 'badge'
      });

      expect(transmissionErrorSpy).to.not.be.called;
      expect(transmittedSpy).to.have.been.calledWith('success', 'URI');
      expect(errorSpy).to.not.be.called;
    });
  });
});
