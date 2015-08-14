require('replay');
var expect = require('chai').expect;

var Pivotal = require('../lib/plugins/pivotal.js');

describe('Pivotal', () => {
  describe('#constructor', () => {

  });
  describe('#push', () => {
    it('should push stories', (done) => {
      let pivotal = new Pivotal({
        project: '1407870',
        token: '690eb36760eff666af11c563510fc616'
      });
      let stories = [
        {
          name: 'test1'
        },
        {
          name: 'test2'
        }
      ];
      pivotal.push(stories).then((stories) => {
        expect(stories).to.have.length(2);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('#pull', () => {
    it('should pull stories', (done) => {
      let pivotal = new Pivotal({
        project: '1407870',
        token: '690eb36760eff666af11c563510fc616'
      });
      pivotal.pull().then((stories) => {
        expect(stories).to.have.length(7);
        done();
      }).catch((err) => {
        done(err);
      });
    })
  });
});
