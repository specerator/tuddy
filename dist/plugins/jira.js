'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SCSF = require('../scsf');
var JiraClient = require('jira-connector');

var Jira = (function () {
  function Jira(integration) {
    _classCallCheck(this, Jira);

    if (!('host' in integration)) {
      throw new Error('missing integration.host');
    }
    if (!('username' in integration)) {
      throw new Error('missing integration.username');
    }
    if (!('password' in integration)) {
      throw new Error('missing integration.password');
    }
    this.integration = integration;
    this.headers = {};
    this.client = new JiraClient({
      host: this.integration.host,
      basic_auth: {
        username: this.integration.username,
        password: this.integration.password
      }
    });
  }

  _createClass(Jira, [{
    key: 'push',
    value: function push(stories) {
      var _this = this;

      return Promise.all(stories.map(function (story) {
        return new Promise(function (resolve, reject) {
          _this.client.issue.createIssue({ fields: Jira.toJira(story) }, function (err, issue) {
            if (err) {
              return reject(err);
            }
            return resolve({
              id: issue.id,
              key: issue.key,
              url: issue.url
            });
          });
        });
      }));
    }

    /**
     * Retrieve stories from remote integration
     * @return {array} Stories retrieved from remote integration
     */
  }, {
    key: 'pull',
    value: function pull() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.client.search.search({}, function (err, result) {
          if (err) {
            return reject(err);
          }
          return resolve(result.issues.map(Jira.toSCSF));
        });
      });
    }
  }], [{
    key: 'toJira',
    value: function toJira(input) {
      var merged = SCSF.merge({ data: input });
      var data = merged.data;
      return {
        id: data.id,
        self: data.self,
        key: data.key,
        created: data.date.created,
        updated: data.date.updated,
        duedate: data.date.due,
        summary: data.name,
        description: data.description,
        project: {
          id: data.project.id
        },
        issuetype: {
          name: data.type
        }
      };
    }
  }, {
    key: 'toSCSF',
    value: function toSCSF(data) {
      var jira = {
        meta: {
          source: {
            name: 'jira',
            data: data
          }
        },
        data: {
          id: data.id,
          self: data.self,
          key: data.key,
          name: data.fields.summary,
          description: data.fields.description,
          type: data.fields.issuetype.name,
          date: {
            due: data.fields.duedate,
            created: data.fields.created,
            updated: data.fields.updated
          },
          project: {
            id: data.fields.project.id
          }
        }
      };
      return SCSF.merge(jira);
    }
  }]);

  return Jira;
})();

module.exports = Jira;