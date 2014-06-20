var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var apn = require('apn');
var notify = require('../../../');

describe('APN', function () {
  var pushNotificationFn;

  beforeEach(function () {
    pushNotificationFn = sinon.spy(function (notification) {
      switch (notification.alert) {
        case 'transmission error':
          this.emit('transmissionError');
          break;
        case 'error':
          this.emit('error');
          break;
        case 'valid transmission':
          this.emit('transmitted');
          break;
      }
    });

    function Connection() {
      EventEmitter.call(this);

      this.pushNotification = pushNotificationFn;
    }

    util.inherits(Connection, EventEmitter);

    sinon.stub(apn, 'Connection', Connection);
  });

  afterEach(function () {
    apn.Connection.restore();
  });

  describe('#send', function () {
    var apnSender;

    beforeEach(function () {
      apnSender = notify.apn({foo: 'bar'});
    });

    it('should create notification and send it', function () {
      apnSender.send({
        token: 'myToken',
        alert: 'myAlert'
      });

      expect(apn.Connection).to.be.calledWith({foo: 'bar'});
      expect(pushNotificationFn).to.be.calledWithMatch(
        sinon.match({alert: 'myAlert'}),
        ['myToken']
      );
    });

    it('should accept an array of token', function () {
      apnSender.send({
        token: ['token1', 'token2'],
        alert: 'myAlert'
      });

      expect(apn.Connection).to.be.calledWith({foo: 'bar'});
      expect(pushNotificationFn).to.be.calledWithMatch(
        sinon.match({alert: 'myAlert'}),
        ['token1', 'token2']
      );
    });

    it('should forward "transmissionError" event correctly', function () {
      var transmissionErrorSpy = sinon.spy();
      var transmittedSpy = sinon.spy();
      var errorSpy = sinon.spy();
      apnSender.on('transmissionError', transmissionErrorSpy);
      apnSender.on('transmitted', transmittedSpy);
      apnSender.on('error', errorSpy);

      apnSender.send({
        token: 'myToken',
        alert: 'transmission error'
      });

      expect(transmissionErrorSpy).to.be.called;
      expect(transmittedSpy).to.not.be.called;
      expect(errorSpy).to.not.be.called;
    });


    it('should forward "transmitted" event correctly', function () {
      var transmissionErrorSpy = sinon.spy();
      var transmittedSpy = sinon.spy();
      var errorSpy = sinon.spy();
      apnSender.on('transmissionError', transmissionErrorSpy);
      apnSender.on('transmitted', transmittedSpy);
      apnSender.on('error', errorSpy);

      apnSender.send({
        token: 'myToken',
        alert: 'transmission error'
      });

      expect(transmissionErrorSpy).to.be.called;
      expect(transmittedSpy).to.not.be.called;
      expect(errorSpy).to.not.be.called;
    });

    it('should forward "error" event correctly', function () {
      var transmissionErrorSpy = sinon.spy();
      var transmittedSpy = sinon.spy();
      var errorSpy = sinon.spy();
      apnSender.on('transmissionError', transmissionErrorSpy);
      apnSender.on('transmitted', transmittedSpy);
      apnSender.on('error', errorSpy);

      apnSender.send({
        token: 'myToken',
        alert: 'valid transmission'
      });

      expect(transmissionErrorSpy).to.not.be.called;
      expect(transmittedSpy).to.be.called;
      expect(errorSpy).to.not.be.called;
    });
  });
});