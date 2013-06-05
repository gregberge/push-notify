/*jshint undef:false, expr:true, strict:false */

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    notify = require('../index'),
    config = require('./config/mpns.json');

chai.use(sinonChai);
chai.should();

describe('Protocol mpns', function () {

  beforeEach(function () {
    this.mpns = new notify.mpns.Sender(config.mpns);
  });

  it('should send one notification', function (done) {
    this.mpns.on('transmitted', function () {
      done();
    });

    this.mpns.send({
      pushUri: config.validPushUris[0],
      text1: 'My title',
      text2: 'My text'
    });
  });

  it('should trigger a "transmissionError" event', function (done) {
    this.mpns.on('transmissionError', function (error, pushUri) {
      pushUri.should.be.equal(config.invalidPushUris[0]);
      done();
    });

    this.mpns.send({
      pushUri: config.invalidPushUris[0],
      text1: 'My title',
      text2: 'My text'
    });
  });

  it('should send a notification to several devices', function (done) {
    var errorSpy = sinon.spy(function () {
      if (errorSpy.callCount === config.invalidPushUris.length)
        done();
    });

    this.mpns.on('transmissionError', errorSpy);

    this.mpns.send({
      pushUri: config.invalidPushUris,
      text1: 'My title',
      text2: 'My text'
    });
  });

});