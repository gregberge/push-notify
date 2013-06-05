/*jshint undef:false, expr:true, strict:false */

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    notify = require('../index');

chai.use(sinonChai);
chai.should();

describe('Protocol mpns', function () {

  this.timeout(10000);

  beforeEach(function () {
    this.errorCallback = sinon.spy();

    this.mpns = new notify.mpns.Sender({
      errorCallback: this.errorCallback
    });
  });

  it('should trigger a "transmissionError" event', function (done) {
    this.mpns.on('transmissionError', function (error, pushUri) {
      pushUri.should.be.equal('http://db3.notify.live.net/throttledthirdparty/01.00/AAFXC_0zVCroT7p4bv50JX30AgAAAAADAQAAAAQUZm52OkJXMjg1QTg1QkZDMkUxREQ');
      done();
    });

    this.mpns.send({
      pushUri: 'http://db3.notify.live.net/throttledthirdparty/01.00/AAFXC_0zVCroT7p4bv50JX30AgAAAAADAQAAAAQUZm52OkJXMjg1QTg1QkZDMkUxREQ',
      text1: 'My title',
      text2: 'My text'
    });
  });

  it('should send a notification to several devices', function (done) {
    var errorSpy = sinon.spy(function () {
      if (errorSpy.callCount === 2)
        done();
    });

    this.mpns.on('transmissionError', errorSpy);

    this.mpns.send({
      pushUri: ['http://db3.notify.live.net/throttledthirdparty/01.00/AAFXC_0zVCroT7p4bv50JX30AgAAAAADAQAAAAQUZm52OkJXMjg1QTg1QkZDMkUxREQ', 'http://db3.notify.live.net/throttledthirdparty/01.00/AAFXC_0zVCroT7p4bv50JX30AgAAAAADAQAAAAQUZm52OkJCMjg1QTg1QkZDMkUxREX'],
      text1: 'My title',
      text2: 'My text'
    });
  });

});