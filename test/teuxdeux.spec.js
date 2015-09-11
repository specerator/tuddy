require('replay');
var expect = require('chai').expect;

var Teuxdeux = require('../lib/plugins/teuxdeux.js');

describe('Teuxdeux', () => {
  describe('#push', () => {
    it('should be able to push stories', (done) => {
      let integration = { username: 'tuddy', password: 'tuddypass' };
      var teuxdeux = new Teuxdeux(integration);
      let stories = [
        {
          name: 'test3',
          date: {
            start: '2015-09-11'
          }
        },
        {
          name: 'test4',
          date: {
            start: '2015-09-11'
          }
        }
      ];
      teuxdeux.push(stories).then((stories) => {
        expect(stories).to.have.length(2);
        done();
      });
    });
  });
  describe('#pull', () => {
    it('should be able to pull stories', (done) => {
      let integration = { username: 'tuddy', password: 'tuddypass' };
      var teuxdeux = new Teuxdeux(integration);
      teuxdeux.pull().then((stories) => {
        expect(stories).to.have.length(4);
        done();
      });
    });
  });
});
