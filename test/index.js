var expect = require('chai').expect;
var sinon = require('sinon');

var tuddy = require('../tuddy');

describe('Tuddy', () => {
  describe('#constructor', () => {
    it('should create map of integrations', () => {
      var client = tuddy();
      expect(client.integrations).to.be.a('map');
    });
  });
  describe('#addIntegration', () => {
    it('should register an integration', () => {
      var client = tuddy();
      client.addIntegration({ name: 'trello', type: 'trello', key: '', token: '', board_id: '' });
      expect(client.integrations.get('trello')).to.be.a('object');
      expect(client.integrations.size).to.eql(1);
    });
  });
  describe('#pull', () => {
    it('should load plugin and call pull proxy method', () => {
      var client = tuddy();
      client.addIntegration({ name: 'trello', type: 'trello', board_id: '', key: '', token: '' });

      var spy = sinon.spy(client.plugins.get('trello'), 'pull');

      client.pull('trello');
      expect(spy.called).to.be.true;
    });
  });
  describe('#push', () => {
    it('should load plugin and call push proxy method', () => {
      var client = tuddy();
      client.addIntegration({ name: 'trello', type: 'trello', board_id: '', key: '', token: '' });

      var spy = sinon.spy(client.plugins.get('trello'), 'push');

      client.push('trello', []);
      expect(spy.called).to.be.true;
    });
  });
});
