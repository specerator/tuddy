require('replay');
var expect = require('chai').expect;

var Sprintly = require('../lib/plugins/sprintly.js');

describe('Sprintly', () => {
  // describe('#constructor', () => {
  //   it('should take integration from constructor and set it', () => {
  //     let integration = { repo: '', user: '', access_token: '' };
  //     var Sprintly = new Sprintly(integration);
  //     expect(Sprintly.integration).to.eql(integration);
  //   });
  //   it('should set headers', () => {
  //     let integration = { repo: '', user: '', access_token: '' };
  //     var Sprintly = new Sprintly(integration);
  //     let headers = {
  //       'User-Agent': 'Tuddy',
  //       'Content-Type': 'application/json'
  //     };
  //     expect(Sprintly.headers).to.eql(headers);
  //   });
  // });
  // describe('#url', () => {
  //   it('should generate an API url with querystring', () => {
  //     let integration = { repo: 'tuddy', user: 'tudddy', access_token: 'c136002525ae2a82dec9109c304167226f8f7e7e' };
  //     var Sprintly = new Sprintly(integration);
  //     var url = Sprintly.url({ per_page: 'thing' });
  //     expect(url).to.eql('https://api.Sprintly.com/repos/tudddy/tuddy/issues?per_page=thing');
  //   });
  // });
  describe('#push', () => {
    it('should be able to push stories', (done) => {

      var sprintly = new Sprintly({
        product: '33921',
        email: 'jeff+tuddy@loiselles.com',
        key: 'WHCRvxdjE6aptnBfjZ83ZWaVQEjn7GeF'
      });

      let stories = [
        {
          type: 'task',
          name: 'test3'
        },
        {
          type: 'task',
          name: 'test4'
        }
      ];

      sprintly.push(stories).then((stories) => {
        expect(stories).to.have.length(2);
        done();
      })
    });
  });
  describe('#pull', () => {
    it('should be able to pull stories', (done) => {
      var sprintly = new Sprintly({
        product: '33921',
        email: 'jeff+tuddy@loiselles.com',
        key: 'WHCRvxdjE6aptnBfjZ83ZWaVQEjn7GeF'
      });
      sprintly.pull().then((stories) => {
        expect(stories).to.have.length(1);
        done();
      });
    });
  });
});
