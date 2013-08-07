/*jshint undef:false, expr:true, strict:false */

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    notify = require('../index'),
    config = require('./config/gcm.json');

chai.use(sinonChai);
chai.should();

describe('Protocol gcm', function () {

  beforeEach(function () {
    this.gcm = new notify.gcm.Sender(config.gcm);
  });

  it('should send one notification', function (done) {
    this.gcm.on('transmitted', function () {
      done();
    });

    this.gcm.send({
      registration_id: config.validRegistrationIds[0],
      collapseKey: 'Test x',
      delayWhileIdle: false,
      data: {
        'title': 'my tilte',
        'message': 'This is my message text'
      }
    });

  });

  it('should trigger a "transmissionError" event', function (done) {
    
    this.gcm.on('transmissionError', function (error, data) {
      error.should.equal('InvalidRegistration');
      data.registration_id.should.equal(config.invalidRegistrationIds[0]);
      done();
    });

    this.gcm.send({
      registration_id: config.invalidRegistrationIds[0],
      collapseKey: 'x',
      data: {
        'title': 'my tilte',
        'message': 'Value 1'
      }
    });
  });

  it('should send a notification to several devices', function (done) {
    var errorSpy = sinon.spy(function () {
      if (errorSpy.callCount === config.invalidRegistrationIds.length)
        done();
    });

    this.gcm.on('transmissionError', errorSpy);

    this.gcm.send({
      registration_id: config.invalidRegistrationIds,
      collapseKey: 'x',
      data: {
        'title': 'my tilte',
        'message': 'Value 1'
      }
    });
  });
  

});