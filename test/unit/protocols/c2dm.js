var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');
var notify = require('../../../');
var c2dmModule = require('c2dm');

describe('C2DM', function () {
  describe('#send', function () {
    var c2dmMock, c2dmSender;

    beforeEach(function () {
      c2dmMock = {
        setMaxListeners: sinon.stub(),
        login: sinon.stub(),
        send: sinon.stub()
      };

      sinon.stub(c2dmModule, 'C2DM', function () {
        return c2dmMock;
      });

      c2dmSender = notify.c2dm({user: 'test@gmail.com'});
    });

    afterEach(function () {
      c2dmModule.C2DM.restore();
    });

    describe('with a login error', function () {
      beforeEach(function () {
        c2dmMock.login.yields('error');
        c2dmMock.send.yields();
      });

      it('should emit an "error" and "transmissionError" events', function (done) {
        var transmissionErrorSpy = sinon.spy();
        var transmittedSpy = sinon.spy();
        var errorSpy = sinon.spy();
        c2dmSender.on('transmissionError', transmissionErrorSpy);
        c2dmSender.on('transmitted', transmittedSpy);
        c2dmSender.on('error', errorSpy);

        c2dmSender.send({
          registration_id: ['myRegistrationId1', 'myRegistrationId2'],
          collapse_key: 'myCollapseKey',
          'data.message': 'my message'
        });

        expect(c2dmModule.C2DM).to.be.calledWith({user: 'test@gmail.com'});

        setTimeout(function () {
          expect(errorSpy).to.be.calledOnce;
          expect(errorSpy).to.be.calledWith(sinon.match({message: 'error'}));
          expect(transmissionErrorSpy).to.be.calledWith(
            sinon.match({message: 'error'}),
            {
              registration_id: 'myRegistrationId1',
              collapse_key: 'myCollapseKey',
              'data.message': 'my message'
            },
            'myRegistrationId1'
          );
          expect(transmissionErrorSpy).to.be.calledWith(
            sinon.match({message: 'error'}),
            {
              registration_id: 'myRegistrationId2',
              collapse_key: 'myCollapseKey',
              'data.message': 'my message'
            },
            'myRegistrationId2'
          );
          expect(transmittedSpy).to.not.be.called;
          done();
        }, 0);
      });
    });

    describe('with an error during sending', function () {
      beforeEach(function () {
        c2dmMock.login.yields();
        c2dmMock.send.yields('error');
      });

      it('should emit a "transmissionError" event', function (done) {
        var transmissionErrorSpy = sinon.spy();
        var transmittedSpy = sinon.spy();
        var errorSpy = sinon.spy();
        c2dmSender.on('transmissionError', transmissionErrorSpy);
        c2dmSender.on('transmitted', transmittedSpy);
        c2dmSender.on('error', errorSpy);

        c2dmSender.send({
          registration_id: ['myRegistrationId1', 'myRegistrationId2'],
          collapse_key: 'myCollapseKey',
          'data.message': 'my message'
        });

        expect(c2dmModule.C2DM).to.be.calledWith({user: 'test@gmail.com'});

        setTimeout(function () {
          expect(transmissionErrorSpy).to.be.calledWith(
            sinon.match('error'),
            {
              registration_id: 'myRegistrationId1',
              collapse_key: 'myCollapseKey',
              'data.message': 'my message'
            },
            'myRegistrationId1'
          );
          expect(transmissionErrorSpy).to.be.calledWith(
            sinon.match('error'),
            {
              registration_id: 'myRegistrationId2',
              collapse_key: 'myCollapseKey',
              'data.message': 'my message'
            },
            'myRegistrationId2'
          );
          expect(errorSpy).to.not.be.called;
          expect(transmittedSpy).to.not.be.called;
          done();
        }, 0);
      });
    });

    describe('without error', function () {
      beforeEach(function () {
        c2dmMock.login.yields();
        c2dmMock.send.yields(null, 'messageId');
      });

      it('should emit a "transmitted" event', function (done) {
        var transmissionErrorSpy = sinon.spy();
        var transmittedSpy = sinon.spy();
        var errorSpy = sinon.spy();
        c2dmSender.on('transmissionError', transmissionErrorSpy);
        c2dmSender.on('transmitted', transmittedSpy);
        c2dmSender.on('error', errorSpy);

        c2dmSender.send({
          registration_id: ['myRegistrationId1', 'myRegistrationId2'],
          collapse_key: 'myCollapseKey',
          'data.message': 'my message'
        });

        expect(c2dmModule.C2DM).to.be.calledWith({user: 'test@gmail.com'});

        setTimeout(function () {
          expect(transmittedSpy).to.be.calledWith(
            'messageId',
            {
              registration_id: 'myRegistrationId1',
              collapse_key: 'myCollapseKey',
              'data.message': 'my message'
            },
            'myRegistrationId1'
          );
          expect(transmittedSpy).to.be.calledWith(
            'messageId',
            {
              registration_id: 'myRegistrationId2',
              collapse_key: 'myCollapseKey',
              'data.message': 'my message'
            },
            'myRegistrationId2'
          );
          expect(errorSpy).to.not.be.called;
          expect(transmissionErrorSpy).to.not.be.called;
          done();
        }, 0);
      });

      it('should should work with a single registrationId', function (done) {
        var transmissionErrorSpy = sinon.spy();
        var transmittedSpy = sinon.spy();
        var errorSpy = sinon.spy();
        c2dmSender.on('transmissionError', transmissionErrorSpy);
        c2dmSender.on('transmitted', transmittedSpy);
        c2dmSender.on('error', errorSpy);

        c2dmSender.send({
          registration_id: 'myRegistrationId',
          collapse_key: 'myCollapseKey',
          'data.message': 'my message'
        });

        expect(c2dmModule.C2DM).to.be.calledWith({user: 'test@gmail.com'});

        setTimeout(function () {
          expect(transmittedSpy).to.be.calledWith(
            'messageId',
            {
              registration_id: 'myRegistrationId',
              collapse_key: 'myCollapseKey',
              'data.message': 'my message'
            },
            'myRegistrationId'
          );
          expect(errorSpy).to.not.be.called;
          expect(transmissionErrorSpy).to.not.be.called;
          done();
        }, 0);
      });
    });
  });
});