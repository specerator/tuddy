require('replay');
var expect = require('chai').expect;

var Jira = require('../lib/plugins/jira.js');

describe('Jira', () => {
  describe('#constructor', () => {

  });
  describe('#toSCSF', () => {
    it('should correctly convert format', () => {
      var jira = {
        expand: 'operations,versionedRepresentations,editmeta,changelog,transitions,renderedFields',
        id: '10036',
        self: 'https://tudddy.atlassian.net/rest/api/2/issue/10036',
        key: 'TUD-37',
        fields: {
          issuetype: {
            self: 'https://tudddy.atlassian.net/rest/api/2/issuetype/3',
            id: '3',
            description: 'A task that needs to be done.',
            iconUrl: 'https://tudddy.atlassian.net/images/icons/issuetypes/task.png',
            name: 'Task',
            subtask: false
          },
          timespent: null,
          project: {
            self: 'https://tudddy.atlassian.net/rest/api/2/project/10000',
            id: '10000',
            key: 'TUD',
            name: 'tuddy',
            avatarUrls: [Object]
          },
          fixVersions: [],
          aggregatetimespent: null,
          resolution: null,
          resolutiondate: null,
          workratio: -1,
          lastViewed: null,
          watches: {
            self: 'https://tudddy.atlassian.net/rest/api/2/issue/TUD-37/watchers',
            watchCount: 0,
            isWatching: false
          },
          created: '2015-08-13T17:32:12.000-0400',
          customfield_10020: null,
          customfield_10021: null,
          customfield_10022: null,
          priority: {
            self: 'https://tudddy.atlassian.net/rest/api/2/priority/3',
            iconUrl: 'https://tudddy.atlassian.net/images/icons/priorities/medium.png',
            name: 'Medium',
            id: '3'
          },
          customfield_10023: 'Not Started',
          customfield_10024: null,
          labels: [],
          customfield_10016: null,
          customfield_10017: null,
          customfield_10018: null,
          customfield_10019: null,
          timeestimate: null,
          aggregatetimeoriginalestimate: null,
          versions: [],
          issuelinks: [],
          assignee: null,
          updated: '2015-08-13T17:32:12.000-0400',
          status: {
            self: 'https://tudddy.atlassian.net/rest/api/2/status/10000',
            description: '',
            iconUrl: 'https://tudddy.atlassian.net/images/icons/statuses/open.png',
            name: 'To Do',
            id: '10000',
            statusCategory: [Object]
          },
          components: [],
          timeoriginalestimate: null,
          description: null,
          customfield_10012: '0|i0007z:',
          customfield_10013: null,
          customfield_10014: null,
          customfield_10015: null,
          customfield_10007: null,
          customfield_10009: null,
          aggregatetimeestimate: null,
          summary: 'test3',
          creator: {
            self: 'https://tudddy.atlassian.net/rest/api/2/user?username=admin',
            name: 'admin',
            key: 'admin',
            emailAddress: 'jeff+tuddy@loiselles.com',
            avatarUrls: [Object],
            displayName: 'Jeff Loiselle [Administrator]',
            active: true,
            timeZone: 'America/New_York'
          },
          subtasks: [],
          reporter: {
            self: 'https://tudddy.atlassian.net/rest/api/2/user?username=admin',
            name: 'admin',
            key: 'admin',
            emailAddress: 'jeff+tuddy@loiselles.com',
            avatarUrls: [Object],
            displayName: 'Jeff Loiselle [Administrator]',
            active: true,
            timeZone: 'America/New_York'
          },
          customfield_10000: null,
          aggregateprogress: {
            progress: 0,
            total: 0
          },
          customfield_10001: null,
          customfield_10002: null,
          customfield_10003: null,
          customfield_10004: null,
          environment: null,
          duedate: null,
          progress: {
            progress: 0,
            total: 0
          },
          votes: {
            self: 'https://tudddy.atlassian.net/rest/api/2/issue/TUD-37/votes',
            votes: 0,
            hasVoted: false
          }
        }
      }

      var expected = { meta: { source: { id: null, name: 'jira', key: null } },
      data:
      { id: '10036',
      self: 'https://tudddy.atlassian.net/rest/api/2/issue/10036',
      key: 'TUD-37',
      name: 'test3',
      description: null,
      type: 'Task',
      url: null,
      archived: null,
      status: null,
      email: null,
      short_url: null,
      date:
      { start: null,
        end: null,
        due: null,
        created: '2015-08-13T17:32:12.000-0400',
        updated: '2015-08-13T17:32:12.000-0400',
        completed: null,
        deleted: null },
        lists: [],
        labels: [],
        project: { id: '10000' },
        document: { id: null, range: null },
        users: [] } };

      var story = Jira.toSCSF(jira);
      expect(story.meta.source.data).to.be.an('object');
      delete story.meta.source.data;
      expect(story).to.eql(expected);

    });
  });
  describe('#toJira', () => {
    it('should correctly convert format', () => {
      var scsf = {
        id: '10036',
        self: 'https://tudddy.atlassian.net/rest/api/2/issue/10036',
        key: 'TUD-37',
        name: 'test3',
        description: null,
        type: 'Task',
        url: null,
        archived: null,
        status: null,
        email: null,
        short_url: null,
        date: {
          start: null,
          end: null,
          due: null,
          created: '2015-08-13T17:32:12.000-0400',
          updated: '2015-08-13T17:32:12.000-0400',
          completed: null,
          deleted: null
        },
        lists: [],
        labels: [],
        project: {
          id: '10000'
        },
        users: []
      };
      var jira = Jira.toJira(scsf);
      var expected = {
        id: '10036',
        self: 'https://tudddy.atlassian.net/rest/api/2/issue/10036',
        key: 'TUD-37',
        created: '2015-08-13T17:32:12.000-0400',
        updated: '2015-08-13T17:32:12.000-0400',
        duedate: null,
        summary: 'test3',
        description: null,
        project: {
          id: '10000'
        },
        issuetype: {
          name: 'Task'
        }
      };
      expect(jira).to.eql(expected);
    });
  });
  describe('#push', () => {
    it('should push stories', (done) => {
      let jira = new Jira({
        host: 'tudddy.atlassian.net',
        username: 'admin',
        password: 'tuddypass'
      });
      let stories = [
        {
          name: 'test3',
          project_key: 'TUD',
          type: 'Task'
        },
        {
          name: 'test4',
          project_key: 'TUD',
          type: 'Task'
        }
      ];
      jira.push(stories).then((stories) => {
        expect(stories).to.have.length(2);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
  describe('#pull', () => {
    it('should pull stories', (done) => {
      let jira = new Jira({
        host: 'tudddy.atlassian.net',
        username: 'admin',
        password: 'tuddypass'
      });
      jira.pull().then((stories) => {
        expect(stories).to.have.length(37);
        done();
      }).catch((err) => {
        done(err);
      });
    })
  });
});
