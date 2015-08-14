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
