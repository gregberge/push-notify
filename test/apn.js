/*jshint undef:false, expr:true, strict:false */

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    notify = require('../index'),
    config = require('./config/apn.json');

chai.use(sinonChai);
chai.should();

describe('Protocol apn', function () {

  beforeEach(function () {
    this.apn = new notify.apn.Sender(config.apn);
  });

  it('should send notification', function (done) {
    var errorSpy = sinon.spy();

    this.apn.on('transmissionError', errorSpy);

    this.apn.on('transmitted', function () {
      errorSpy.should.not.be.called;
      done();
    });

    this.apn.send({
      token: config.validTokens[0],
      alert: 'Simple notification'
    });
  });

  it('should send a notification to several devices', function (done) {
    var errorSpy = sinon.spy(),
    transmittedSpy = sinon.spy(function () {
      if (transmittedSpy.callCount === 2) {
        errorSpy.should.not.be.called;
        done();
      }
    });

    this.apn.on('transmissionError', errorSpy);
    this.apn.on('transmitted', transmittedSpy);

    this.apn.send({
      token: config.validTokens,
      alert: 'Multi (x2)',
      sound: 'dong.caf'
    });
  });

  it('should emit a "transmissionError" event if a device is invalid', function (done) {
    this.apn.on('transmissionError', function (errorCode, notification, device) {
      errorCode.should.equal(8);
      device.token.toString('hex').should.equal(config.invalidTokens[0]);
      done();
    });

    this.apn.send({
      token: config.invalidTokens[0],
      alert: 'Bad token'
    });
  });

  it('should send notifications even if an error occurs', function (done) {
    var transmittedSpy = sinon.spy(function () {
      if (transmittedSpy.callCount === 3)
        done();
    });

    this.apn.on('transmitted', transmittedSpy);

    this.apn.send({
      token: config.invalidTokens[0],
      alert: 'Bad token'
    });

    this.apn.send({
      token: config.validTokens[0],
      alert: 'Rewrited notification'
    });
  });
});