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
    this.errorCallback = sinon.spy();

    this.apn = new notify.apn.Sender({
      key: './test/config/apn/key.pem',
      cert: './test/config/apn/cert.pem',
      errorCallback: this.errorCallback
    });
  });

  it('should send notification', function (done) {
    var errorSpy = sinon.spy();

    this.apn.on('error', errorSpy);
    this.apn.on('transmissionError', errorSpy);

    this.apn.on('transmitted', function () {
      errorSpy.should.not.be.called;
      done();
    });

    this.apn.send({
      token: 'f9bd575ce7109f79caaf6eb2648a84e2bad28b3bb7c9f7208fec5b790c419617',
      alert: 'Hello World !',
      sound: 'dong.caf'
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

    this.apn.on('error', errorSpy);
    this.apn.on('transmissionError', errorSpy);
    this.apn.on('transmitted', transmittedSpy);

    this.apn.send({
      token: ['a37bf7c43329cccc82f9eb48e50ad3bb72d296a0377d1697cf91a207f3c37a5a', 'f9bd575ce7109f79caaf6eb2648a84e2bad28b3bb7c9f7208fec5b790c419617'],
      alert: 'Hello world!',
      sound: 'dong.caf'
    });
  });

  it('should call errorCallback and send other notifications', function (done) {
    var self = this,
        transmittedSpy = sinon.spy(function () {
          if (transmittedSpy.callCount === 3) {
            self.errorCallback.should.be.called;
            done();
          }
        });

    this.apn.on('transmitted', transmittedSpy);

    this.apn.send({
      token: 'xxx',
      alert: 'Hello World !'
    });

    this.apn.send({
      token: 'f9bd575ce7109f79caaf6eb2648a84e2bad28b3bb7c9f7208fec5b790c419617',
      alert: 'Hello World !',
      sound: 'dong.caf'
    });
  });
});