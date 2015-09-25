require('replay');
var expect = require('chai').expect;

var Pivotal = require('../lib/plugins/pivotal.js');

describe('Pivotal', () => {
  describe('#constructor', () => {

  });
  describe('#toSCSF', () => {
    it('should correctly convert format', () => {
      var pivotal = {
        kind: 'story',
        id: 101250808,
        created_at: '2015-08-13T23:18:17Z',
        updated_at: '2015-08-13T23:18:17Z',
        story_type: 'feature',
        name: 'test2',
        current_state: 'unscheduled',
        requested_by_id: 1762546,
        project_id: 1407870,
        url: 'https://www.pivotaltracker.com/story/show/101250808',
        owner_ids: [],
        labels: []
      };

      var expected = {
        meta: {
          source: {
            id: null,
            name: 'pivotal',
            key: null
          }
        },
        data: {
          id: 101250808,
          self: null,
          key: null,
          name: 'test2',
          description: null,
          type: 'feature',
          url: 'https://www.pivotaltracker.com/story/show/101250808',
          archived: null,
          status: 'incomplete',
          email: null,
          short_url: null,
          date: {
            start: null,
            end: null,
            due: null,
            created: '2015-08-13T23:18:17Z',
            updated: '2015-08-13T23:18:17Z',
            completed: null,
            deleted: null
          },
          lists: [],
          labels: [],
          project: {
            id: 1407870
          },
          users: []
        }
      };

      var story = Pivotal.toSCSF(pivotal);
      expect(story.meta.source.data).to.be.an('object');
      delete story.meta.source.data;
      expect(story).to.eql(expected);
    });
  });
  describe('#toPivotal', () => {
    it('should correctly convert format', () => {
      var scsf = {
        id: 101250808,
        self: null,
        key: null,
        name: 'test2',
        description: null,
        type: 'feature',
        url: 'https://www.pivotaltracker.com/story/show/101250808',
        archived: null,
        status: 'incomplete',
        email: null,
        short_url: null,
        date: {
          start: null,
          end: null,
          due: null,
          created: '2015-08-13T23:18:17Z',
          updated: '2015-08-13T23:18:17Z',
          completed: null,
          deleted: null
        },
        lists: [],
        labels: [],
        project: {
          id: 1407870
        },
        users: []
      };

      var pivotal = Pivotal.toPivotal(scsf);
      var expected = {
        id: 101250808,
        name: 'test2',
        description: null,
        kind: 'story',
        story_type: 'feature',
        created_at: '2015-08-13T23:18:17Z',
        updated_at: '2015-08-13T23:18:17Z',
        project_id: 1407870,
        current_state: 'unscheduled'
      };
      expect(pivotal).to.eql(expected)
    });
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
