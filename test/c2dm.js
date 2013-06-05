/*jshint undef:false, expr:true, strict:false */

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    notify = require('../index'),
    config = require('./config/c2dm.json');

chai.use(sinonChai);
chai.should();

describe('Protocol c2dm', function () {
  this.timeout(5000);

  beforeEach(function () {
    this.c2dm = new notify.c2dm.Sender(config.c2dm);
  });

  it('should send one notification', function (done) {
    this.c2dm.on('transmitted', function () {
      done();
    });

    this.c2dm.send({
      registration_id: config.validRegistrationIds[0],
      collapse_key: 'x',
      'data.titre': 'My title',
      'data.text': 'My text'
    });
  });

  it('should trigger a "transmissionError" event', function (done) {
    this.c2dm.on('transmissionError', function (error, data) {
      error.should.equal('InvalidRegistration');
      data.registration_id.should.equal(config.invalidRegistrationIds[0]);
      done();
    });

    this.c2dm.send({
      registration_id: config.invalidRegistrationIds[0],
      collapse_key: 'x',
      'data.titre': 'My title',
      'data.text': 'My text'
    });
  });

  it('should send a notification to several devices', function (done) {
    var errorSpy = sinon.spy(function () {
      if (errorSpy.callCount === config.invalidRegistrationIds.length)
        done();
    });

    this.c2dm.on('transmissionError', errorSpy);

    this.c2dm.send({
      registration_id: config.invalidRegistrationIds,
      collapse_key: 'x',
      'data.titre': 'My title',
      'data.text': 'My text'
    });
  });

  it('should share a token', function (done) {
    var self = this,
    c2dmBis = new notify.c2dm.Sender(config.c2dm),
    c = 0,
    end = function () {
      c++;

      if (c === 4)
        done();
    },
    sendStd = function () {
      self.c2dm.send({
        registration_id: config.invalidRegistrationIds[0],
        collapse_key: 'x',
        'data.titre': 'My title',
        'data.text': 'My text'
      });
    },
    sendBis = function () {
      c2dmBis.send({
        registration_id: config.invalidRegistrationIds[0],
        collapse_key: 'x',
        'data.titre': 'My title',
        'data.text': 'My text'
      });
    };

    this.c2dm.on('transmissionError', function () {
      console.log('std', self.c2dm.c2dm.token);

      if (c === 0 || c === 2)
        sendBis();

      end();
    });

    c2dmBis.on('transmissionError', function () {
      console.log('bis', c2dmBis.c2dm.token);

      if (c === 1)
        sendStd();

      end();
    });

    sendStd();
  });

});