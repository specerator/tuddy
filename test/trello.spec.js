require('replay');
var expect = require('chai').expect;

var Trello = require('../lib/plugins/trello.js');

describe('Trello', () => {
  describe('#toSCSF', () => {
    it('should correctly convert format', () => {
      var trello = {
        pos: 65535,
        descData: null,
        manualCoverAttachment: false,
        labels: [],
        idAttachmentCover: null,
        idLabels: [],
        idShort: 1,
        name: 'test1',
        desc: '',
        idMembersVoted: [],
        shortUrl: 'https://trello.com/c/ZNUzB6mn',
        idBoard: '55ccc49df22b549c64f3b91e',
        idChecklists: [],
        url: 'https://trello.com/c/ZNUzB6mn/1-test1',
        email: 'tuddy@example.com',
        checkItemStates: [],
        dateLastActivity: '2015-08-13T16:24:09.303Z',
        idMembers: [],
        idList: '55ccc4a5e08262688ef56a96',
        subscribed: false,
        shortLink: 'ZNUzB6mn',
        closed: false,
        badges: {
          votes: 0,
          viewingMemberVoted: false,
          subscribed: false,
          fogbugz: '',
          checkItems: 0,
          checkItemsChecked: 0,
          comments: 0,
          attachments: 0,
          description: false,
          due: null
        },
        due: null,
        id: '55ccc4a9d3294f7a68cc90f3'
      };

      var expected = {
        meta: {
          source: {
            id: null,
            name: 'trello',
            key: null
          }
        },
        data: {
          id: '55ccc4a9d3294f7a68cc90f3',
          self: null,
          key: 'ZNUzB6mn',
          name: 'test1',
          description: '',
          type: null,
          url: 'https://trello.com/c/ZNUzB6mn/1-test1',
          archived: null,
          status: 'incomplete',
          email: 'tuddy@example.com',
          short_url: 'https://trello.com/c/ZNUzB6mn',
          date: {
            start: null,
            end: null,
            due: null,
            created: null,
            updated: '2015-08-13T16:24:09.303Z',
            completed: null,
            deleted: null
          },
          lists: [],
          labels: [],
          project: {
            id: null
          },
          users: []
        }
      };

      var story = Trello.toSCSF(trello);
      expect(story.meta.source.data).to.be.an('object');
      delete story.meta.source.data;
      expect(story).to.eql(expected)

    });
  });
  describe('#toTrello', () => {
    it('should correctly convert format', () => {
      var scsf = {
        id: '55ccc4a9d3294f7a68cc90f3',
        self: null,
        key: 'ZNUzB6mn',
        name: 'test1',
        description: '',
        type: null,
        url: 'https://trello.com/c/ZNUzB6mn/1-test1',
        archived: null,
        status: 'incomplete',
        email: 'tuddy@example.com',
        short_url: 'https://trello.com/c/ZNUzB6mn',
        date: {
          start: null,
          end: null,
          due: null,
          created: null,
          updated: '2015-08-13T16:24:09.303Z',
          completed: null,
          deleted: null
        },
        lists: [],
        labels: [],
        project: {
          id: null
        },
        users: []
      };
      var trello = Trello.toTrello(scsf);
      var expected = {
        name: 'test1',
        shortLink: 'ZNUzB6mn',
        url: 'https://trello.com/c/ZNUzB6mn/1-test1',
        desc: '',
        shortUrl: 'https://trello.com/c/ZNUzB6mn',
        email: 'tuddy@example.com',
        due: null,
        dateLastActivity: '2015-08-13T16:24:09.303Z',
        closed: false
      };
      expect(trello).to.eql(expected);
    });
  });
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
