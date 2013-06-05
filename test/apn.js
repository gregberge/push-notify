/*jshint undef:false, expr:true, strict:false */

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    notify = require('../index');

chai.use(sinonChai);
chai.should();

describe('Protocol apn', function () {

  this.timeout(10000);

  beforeEach(function () {
    this.apn = new notify.apn.Sender({
      key: './test/config/apn/key.pem',
      cert: './test/config/apn/cert.pem'
    });
  });

  it('should send notification', function (done) {
    var errorSpy = sinon.spy();

    this.apn.on('transmissionError', errorSpy);

    this.apn.on('transmitted', function () {
      errorSpy.should.not.be.called;
      done();
    });

    this.apn.send({
      token: 'f9bd575ce7109f79caaf6eb2648a84e2bad28b3bb7c9f7208fec5b790c419617',
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
      token: ['50520d714692ca59248a35e3abe6f415cc3c3bebb3008079efd92edab7f7a1f7', 'f9bd575ce7109f79caaf6eb2648a84e2bad28b3bb7c9f7208fec5b790c419617'],
      alert: 'Multi (x2)',
      sound: 'dong.caf'
    });
  });

  it('should emit a "transmissionError" event if a device is invalid', function (done) {
    this.apn.on('transmissionError', function (errorCode, notification, device) {
      errorCode.should.equal(8);
      device.token.toString('hex').should.equal('f9cd575ce7109f79caaf6eb2648a84e2bad28b3bb7c9f7208fec5b790c419617');
      done();
    });

    this.apn.send({
      token: 'f9cd575ce7109f79caaf6eb2648a84e2bad28b3bb7c9f7208fec5b790c419617',
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
      token: 'xxx',
      alert: 'Bad token'
    });

    this.apn.send({
      token: 'f9bd575ce7109f79caaf6eb2648a84e2bad28b3bb7c9f7208fec5b790c419617',
      alert: 'Rewrited notification'
    });
  });
});