var expect = require('chai').use(require('sinon-chai')).expect;
var sinon = require('sinon');
var notify = require('../../../');
var gcm = require('node-gcm');

describe('GCM', function () {
  describe('#send', function () {
    var senderMock, gcmSender;

    beforeEach(function () {
      senderMock = {
        send: sinon.stub()
      };

      sinon.stub(gcm, 'Sender', function () {
        return senderMock;
      });

      gcmSender = notify.gcm({
        apiKey: 'myApiKey',
        retries: 4
      });
    });

    afterEach(function () {
      gcm.Sender.restore();
    });

    it('should create notification and send it', function () {
      gcmSender.send({
        registrationId: 'myRegistrationId',
        collapseKey: 'myCollapseKey',
        data: {
          title: 'my title',
          message: 'my message'
        }
      });

      expect(gcm.Sender).to.be.calledWith('myApiKey');
      expect(senderMock.send).to.be.calledWith(sinon.match({
        collapseKey: 'myCollapseKey',
        data: {message: 'my message', title: 'my title'}
      }), ['myRegistrationId'], 4);
    });

    it('should be possible to send to several registration ids', function () {
      gcmSender.send({
        registrationId: ['myRegistrationId1', 'myRegistrationId2'],
        collapseKey: 'myCollapseKey',
        data: {
          title: 'my title',
          message: 'my message'
        }
      });

      expect(gcm.Sender).to.be.calledWith('myApiKey');
      expect(senderMock.send).to.be.calledWith(sinon.match({
        collapseKey: 'myCollapseKey',
        data: {message: 'my message', title: 'my title'}
      }), ['myRegistrationId1', 'myRegistrationId2'], 4);
    });

    describe('with an error', function () {
      beforeEach(function () {
        senderMock.send.yields('error');
      });

      it('should only emit a "transmissionError" event', function () {
        var transmissionErrorSpy = sinon.spy();
        var transmittedSpy = sinon.spy();
        gcmSender.on('transmissionError', transmissionErrorSpy);
        gcmSender.on('transmitted', transmittedSpy);

        gcmSender.send({
          registrationId: ['myRegistrationId1', 'myRegistrationId2'],
          collapseKey: 'myCollapseKey',
          data: {foo: 'bar'}
        });

        expect(transmissionErrorSpy).to.be.calledWith('error', sinon.match({
          data: {foo: 'bar'}
        }), 'myRegistrationId1');
        expect(transmissionErrorSpy).to.be.calledWith('error', sinon.match({
          data: {foo: 'bar'}
        }), 'myRegistrationId2');
        expect(transmittedSpy).to.not.be.called;
      });
    });

    describe('with an error in results', function () {
      beforeEach(function () {
        senderMock.send.yields(null, {
          results: [
            {error: 'error'}
          ]
        });
      });

      it('should only emit a "transmissionError" event', function () {
        var transmissionErrorSpy = sinon.spy();
        var transmittedSpy = sinon.spy();
        gcmSender.on('transmissionError', transmissionErrorSpy);
        gcmSender.on('transmitted', transmittedSpy);

        gcmSender.send({
          registrationId: ['myRegistrationId1', 'myRegistrationId2'],
          collapseKey: 'myCollapseKey',
          data: {foo: 'bar'}
        });

        expect(transmissionErrorSpy).to.be.calledWith('error', sinon.match({
          data: {foo: 'bar'}
        }), 'myRegistrationId1');
        expect(transmissionErrorSpy).to.not.be.calledWith('error', sinon.match({
          data: {foo: 'bar'}
        }), 'myRegistrationId2');
        expect(transmittedSpy).to.not.be.called;
      });
    });

    describe('with a registration_id in results', function () {
      beforeEach(function () {
        senderMock.send.yields(null, {
          results: [
            {registration_id: 'newRegistrationId'}
          ]
        });
      });

      it('should emit a "updated" event', function () {
        var updatedSpy = sinon.spy();
        gcmSender.on('updated', updatedSpy);

        gcmSender.send({
          registrationId: ['myRegistrationId1', 'myRegistrationId2'],
          collapseKey: 'myCollapseKey',
          data: {foo: 'bar'}
        });

        expect(updatedSpy).to.be.calledWith(
          {registration_id: 'newRegistrationId'},
          'myRegistrationId1'
        );
      });
    });

    describe('without error', function () {
      beforeEach(function () {
        senderMock.send.yields(null, {
          results: [
            {res1: true},
            {res2: true}
          ]
        });
      });

      it('should emit a "transmitted" event', function () {
        var transmissionErrorSpy = sinon.spy();
        var transmittedSpy = sinon.spy();
        gcmSender.on('transmissionError', transmissionErrorSpy);
        gcmSender.on('transmitted', transmittedSpy);

        gcmSender.send({
          registrationId: ['myRegistrationId1', 'myRegistrationId2'],
          collapseKey: 'myCollapseKey',
          data: {foo: 'bar'}
        });

        expect(transmittedSpy).to.be.calledWith({res1: true}, sinon.match({
          data: {foo: 'bar'}
        }), 'myRegistrationId1');
        expect(transmittedSpy).to.be.calledWith({res2: true}, sinon.match({
          data: {foo: 'bar'}
        }), 'myRegistrationId2');
        expect(transmissionErrorSpy).to.not.be.called;
      });
    });
  });
});