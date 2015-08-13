require('replay');
var expect = require('chai').expect;

var Jira = require('../lib/plugins/jira.js');

describe('Jira', () => {
  describe('#constructor', () => {

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
