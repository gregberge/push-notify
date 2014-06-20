var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');
var mpns = require('mpns');
var notify = require('../../../');

describe('MPNS', function () {
  beforeEach(function () {
    sinon.stub(mpns, 'sendToast');
  });

  afterEach(function () {
    mpns.sendToast.restore();
  });

  describe('#mpns.send', function () {
    var mpnsSender;

    beforeEach(function () {
      mpnsSender = notify.mpns();
    });

    it('should be possible to call it with one pushUri', function () {
      mpnsSender.send({
        pushUri: 'myPushUri',
        text1: 'foo',
        text2: 'bar'
      });

      expect(mpns.sendToast).to.be.calledOnce;
      expect(mpns.sendToast).to.be.calledWith('myPushUri', {
        text1: 'foo',
        text2: 'bar'
      });
    });

    it('should be possible to call it with an array of pushUri', function () {
      mpnsSender.send({
        pushUri: ['firstPushUri', 'secondPushUri'],
        text1: 'foo',
        text2: 'bar'
      });

      expect(mpns.sendToast).to.be.calledTwice;
      expect(mpns.sendToast).to.be.calledWith('firstPushUri', {
        text1: 'foo',
        text2: 'bar'
      });
      expect(mpns.sendToast).to.be.calledWith('secondPushUri', {
        text1: 'foo',
        text2: 'bar'
      });
    });

    describe('with a transmissionError', function () {
      beforeEach(function () {
        mpns.sendToast.yields({
          shouldDeleteChannel: true
        });
      });

      it('should only emit a "transmissionError" event', function () {
        var transmissionErrorSpy = sinon.spy();
        var transmittedSpy = sinon.spy();
        var errorSpy = sinon.spy();
        mpnsSender.on('transmissionError', transmissionErrorSpy);
        mpnsSender.on('transmitted', transmittedSpy);
        mpnsSender.on('error', errorSpy);

        mpnsSender.send({
          pushUri: 'myPushUri',
          text1: 'foo',
          text2: 'bar'
        });

        expect(transmissionErrorSpy).to.be.calledWith({
          shouldDeleteChannel: true
        }, {text1: 'foo', text2: 'bar'}, 'myPushUri');
        expect(transmittedSpy).to.not.be.called;
        expect(errorSpy).to.not.be.called;
      });
    });

    describe('without error', function () {
      beforeEach(function () {
        mpns.sendToast.yields(null, {foo: 'bar'});
      });

      it('should only emit a "transmitted" event', function () {
        var transmissionErrorSpy = sinon.spy();
        var transmittedSpy = sinon.spy();
        var errorSpy = sinon.spy();
        mpnsSender.on('transmissionError', transmissionErrorSpy);
        mpnsSender.on('transmitted', transmittedSpy);
        mpnsSender.on('error', errorSpy);

        mpnsSender.send({
          pushUri: 'myPushUri',
          text1: 'foo',
          text2: 'bar'
        });

        expect(errorSpy).to.not.be.called;
        expect(transmissionErrorSpy).to.not.be.called;
        expect(transmittedSpy).to.be.calledWith({foo: 'bar'}, {text1: 'foo', text2: 'bar'}, 'myPushUri');
      });
    });
  });
});