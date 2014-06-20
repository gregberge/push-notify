var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var apn = require('apn');
var notify = require('../../../');

describe('APN', function () {
  var pushNotificationFn, apnSender;

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

    apnSender = notify.apn({foo: 'bar'});
  });

  afterEach(function () {
    apn.Connection.restore();
  });

  describe('#send', function () {
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

  describe('#close', function () {
    describe('without active connection', function () {
      it('should do nothing if there is no connection', function () {
        apnSender.close();
      });

      it('should accept a callback', function (done) {
        apnSender.close(done);
      });
    });

    describe('with an active connection', function () {
      var clock;

      beforeEach(function () {
        clock = sinon.useFakeTimers(0, 'setTimeout');
        apnSender.connection = {
          shutdown: sinon.spy()
        };
      });

      afterEach(function () {
        clock.restore();
      });

      it('should work without callback', function () {
        apnSender.close();
        expect(apnSender.connection.shutdown).to.be.called;
      });

      it('should wait 2600ms if there is a callback', function () {
        var spy = sinon.spy();
        apnSender.close(spy);

        expect(spy).to.not.be.called;

        clock.tick(1000);
        expect(spy).to.not.be.called;

        clock.tick(1000);
        expect(spy).to.not.be.called;

        clock.tick(1000);
        expect(spy).to.be.called;
      });
    });
  });
});