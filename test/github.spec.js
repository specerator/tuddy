require('replay');
var expect = require('chai').expect;

var Github = require('../lib/plugins/github.js');

describe('Github', () => {
  describe('#constructor', () => {
    it('should take integration from constructor and set it', () => {
      let integration = { repo: '', user: '', access_token: '' };
      var github = new Github(integration);
      expect(github.integration).to.eql(integration);
    });
    it('should set headers', () => {
      let integration = { repo: '', user: '', access_token: '' };
      var github = new Github(integration);
      let headers = {
        'User-Agent': 'Tuddy',
        'Content-Type': 'application/json'
      };
      expect(github.headers).to.eql(headers);
    });
  });
  describe('#url', () => {
    it('should generate an API url with querystring', () => {
      let integration = { repo: 'tuddy', user: 'tudddy', access_token: 'c136002525ae2a82dec9109c304167226f8f7e7e' };
      var github = new Github(integration);
      var url = github.url({ per_page: 'thing' });
      expect(url).to.eql('https://api.github.com/repos/tudddy/tuddy/issues?per_page=thing');
    });
  });
  describe('#toSCSF', () => {
    it('should correctly convert data', () => {
      var github = {
        title: 'test3',
        milestone: null,
        url: 'https://api.github.com/repos/tudddy/tuddy/issues/4',
        labels: [],
        html_url: 'https://github.com/tudddy/tuddy/issues/4',
        created_at: '2015-08-13T16:23:05Z',
        comments: 0,
        updated_at: '2015-08-13T16:23:05Z',
        state: 'open',
        locked: false,
        user: {
          gists_url: 'https://api.github.com/users/tudddy/gists{/gist_id}',
          url: 'https://api.github.com/users/tudddy',
          type: 'User',
          avatar_url: 'https://avatars.githubusercontent.com/u/13784755?v=3',
          html_url: 'https://github.com/tudddy',
          organizations_url: 'https://api.github.com/users/tudddy/orgs',
          subscriptions_url: 'https://api.github.com/users/tudddy/subscriptions',
          site_admin: false,
          following_url: 'https://api.github.com/users/tudddy/following{/other_user}',
          followers_url: 'https://api.github.com/users/tudddy/followers',
          starred_url: 'https://api.github.com/users/tudddy/starred{/owner}{/repo}',
          login: 'tudddy',
          events_url: 'https://api.github.com/users/tudddy/events{/privacy}',
          gravatar_id: '',
          id: 13784755,
          repos_url: 'https://api.github.com/users/tudddy/repos',
          received_events_url: 'https://api.github.com/users/tudddy/received_events'
        },
        closed_at: null,
        labels_url: 'https://api.github.com/repos/tudddy/tuddy/issues/4/labels{/name}',
        comments_url: 'https://api.github.com/repos/tudddy/tuddy/issues/4/comments',
        assignee: null,
        events_url: 'https://api.github.com/repos/tudddy/tuddy/issues/4/events',
        number: 4,
        id: 100812367,
        body: null
      };

      var expected = {
        meta: {
          source: {
            id: null,
            name: 'github',
            key: null
          }
        },
        data: {
          id: 100812367,
          self: 'https://api.github.com/repos/tudddy/tuddy/issues/4',
          key: 4,
          name: 'test3',
          description: null,
          type: null,
          url: 'https://github.com/tudddy/tuddy/issues/4',
          archived: null,
          status: 'incomplete',
          email: null,
          short_url: null,
          date: {
            start: null,
            end: null,
            due: null,
            created: '2015-08-13T16:23:05Z',
            updated: '2015-08-13T16:23:05Z',
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

      var story = Github.toSCSF(github);
      expect(story.meta.source.data).to.be.an('object');
      delete story.meta.source.data;
      expect(story).to.eql(expected);
    });
  });
  describe('#toGithub', () => {
    it('should correctly convert data', () => {
      var scsf = {
        id: 100812367,
        self: 'https://api.github.com/repos/tudddy/tuddy/issues/4',
        key: 12345,
        name: 'test3',
        description: 'description',
        type: null,
        url: 'https://github.com/tudddy/tuddy/issues/4',
        archived: null,
        status: 'incomplete',
        email: null,
        short_url: null,
        date: {
          start: null,
          end: null,
          due: null,
          created: '2015-08-13T16:23:05Z',
          updated: '2015-08-13T16:23:05Z',
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
      var github = Github.toGithub(scsf);
      var expected = {
        id: 100812367,
        name: 'test3',
        body: 'description',
        story_type: 'feature',
        url: 'https://api.github.com/repos/tudddy/tuddy/issues/4',
        html_url: 'https://github.com/tudddy/tuddy/issues/4',
        created_at: '2015-08-13T16:23:05Z',
        updated_at: '2015-08-13T16:23:05Z',
        closed_at: null,
        number: 12345,
        state: 'closed'
      };
      expect(github).to.eql(expected);
    });
  });
  describe('#push', () => {
    it('should be able to push stories', (done) => {
      let integration = { repo: 'tuddy', user: 'tudddy', access_token: 'c136002525ae2a82dec9109c304167226f8f7e7e' };
      var github = new Github(integration);
      let stories = [
        {
          name: 'test3'
        },
        {
          name: 'test4'
        }
      ];
      github.push(stories).then((stories) => {
        expect(stories).to.have.length(2);
        done();
      });
    });
  });
  describe('#pull', () => {
    it('should be able to pull stories', (done) => {
      let integration = { repo: 'tuddy', user: 'tudddy', access_token: 'c136002525ae2a82dec9109c304167226f8f7e7e' };
      var github = new Github(integration);
      github.pull().then((stories) => {
        expect(stories).to.have.length(4);
        done();
      });
    });
  });
});
