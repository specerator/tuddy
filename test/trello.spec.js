require('replay');
var expect = require('chai').expect;

var Trello = require('../lib/plugins/trello.js');

describe('Trello', () => {
  describe('#push', () => {
    it('should be able to push stories', (done) => {

      var trello = new Trello({
        name: 'trello',
        type: 'trello',
        key: '87105c2d4268dd05af77c83b64326f8a',
        secret: '9c50679d726b6b6b449f1f3d9183deb09340353a714b2404c6f291b7e30db167',
        token: 'e6691ee3114053746f53504df00a736407b985ce3cd0b2957012fa702ce83065',
        board_id: '55ccc49df22b549c64f3b91e',
        idList: '55ccc4a5e08262688ef56a96'
      });

      let stories = [
        {
          name: 'test1'
        },
        {
          name: 'test2'
        }
      ];

      trello.push(stories).then((stories) => {
        expect(stories).to.have.length(2);
        done();
      }).catch((err) => {
        done(err);
      });

    });
  });
  describe('#pull', () => {
    it('should be able to pull stories', (done) => {

      var trello = new Trello({
        name: 'trello',
        type: 'trello',
        key: '87105c2d4268dd05af77c83b64326f8a',
        secret: '9c50679d726b6b6b449f1f3d9183deb09340353a714b2404c6f291b7e30db167',
        token: 'e6691ee3114053746f53504df00a736407b985ce3cd0b2957012fa702ce83065',
        board_id: '55ccc49df22b549c64f3b91e',
        idList: '55ccc4a5e08262688ef56a96'
      });

      trello.pull('trello').then((stories) => {
        expect(stories).to.have.length(4);
        done();
      }).catch((err) => {
        done(err);
      });

    });
  });
});
