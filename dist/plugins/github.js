'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SCSF = require('../scsf');
var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');
var request = require('request');
request.get = Promise.promisify(request.get, request);

var _url = require('url');

var Github = (function () {
  function Github(integration) {
    _classCallCheck(this, Github);

    if (!('user' in integration)) {
      throw new Error('missing integration.user');
    }
    if (!('repo' in integration)) {
      throw new Error('missing integration.repo');
    }
    if (!('access_token' in integration)) {
      throw new Error('missing integration.access_token');
    }
    this.integration = integration;
    this.headers = {
      'User-Agent': 'Tuddy',
      'Content-Type': 'application/json'
    };
  }

  _createClass(Github, [{
    key: 'url',
    value: function url(data) {
      var user = this.integration.user;
      var repo = this.integration.repo;
      var access_token = this.integration.access_token;
      var endpoint = 'https://api.github.com/repos/' + user + '/' + repo + '/issues?access_token=' + access_token;

      var parsed = _url.parse(endpoint, true);

      if (typeof data != 'undefined') {
        parsed.query = {};
        delete parsed.search;
        if ('per_page' in data) {
          parsed.query.per_page = data.per_page;
        }
        if ('page' in data) {
          parsed.query.page = data.page;
        }
        if ('state' in data) {
          parsed.query.state = data.state;
        }
      }
      return parsed.format(parsed);
    }
  }, {
    key: 'pull',
    value: function pull() {
      return this._findAll({ state: 'all' });
    }
  }, {
    key: 'push',
    value: function push(stories) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var that = _this;
        var out = [];
        async.each(stories, function (story, callback) {
          var github = Github.toGithub(story);
          request.post({ url: that.url(), json: true, headers: that.headers, body: github }, function (err, response, body) {
            if (err) {
              callback(new Error(err));
            }
            out.push(body);
            callback();
          });
        }, function (err) {
          var stories = _.map(out, function (story) {
            return Github.toSCSF(story);
          });
          if (err) {
            return reject(err);
          }
          return resolve(stories);
        });
      });
    }
  }, {
    key: '_query',
    value: function _query(query) {
      var endpoint = query.url || this.url(query);
      return request.get({ url: endpoint, json: true, headers: this.headers }).spread(function (response, body) {
        var next = null;
        if (response.headers['link']) {
          var link = response.headers['link'];
          link.replace(/<([^>]*)>;\s*rel="([\w]*)\"/g, function (m, uri, type) {
            if (type == 'next') {
              next = uri;
            }
          });
        }
        var page = {
          next: next
        };
        return [response, body, page];
      })['catch'](function (err) {
        return new Error(err);
      });
    }
  }, {
    key: '_findAll',
    value: function _findAll(query) {
      var stories = [];
      var that = this;

      function getData(query, callback) {
        that._query(query).spread(function (response, body, page) {
          if (body === undefined) {
            console.log('Github.findAll', query, response, body);
            body = [];
          }
          body.forEach(function (story) {
            stories.push(Github.toSCSF(story));
          });
          if (typeof page != 'undefined' && page.next) {
            query.url = page.next;
            getData(query, callback);
          } else {
            callback();
          }
        });
      }

      var def = Promise.defer();

      getData(query, function () {
        def.resolve(stories);
      });

      return def.promise;
    }
  }], [{
    key: 'toGithub',
    value: function toGithub(input) {
      var merged = SCSF.merge({ data: input });
      var data = merged.data;
      return {
        id: data.id,
        title: data.name,
        body: data.description,
        story_type: "feature",
        url: data.self,
        html_url: data.url,
        created_at: data.date.created,
        updated_at: data.date.updated,
        closed_at: data.date.completed,
        number: data.key,
        state: (function (data) {
          if (data.status == 'completed') {
            return 'open';
          } else {
            return 'closed';
          }
        })(data)
      };
    }

    /**
    * Converts Github data to SCSF format
    * @param  {object} data Github data
    * @return {object} SCSF object
    */
  }, {
    key: 'toSCSF',
    value: function toSCSF(data) {
      var github = {
        meta: {
          source: {
            name: 'github',
            data: data
          }
        },
        data: {
          id: data.id,
          key: data.number,
          self: data.url,
          url: data.html_url,
          name: data.title,
          description: data.body,
          date: {
            created: data.created_at,
            updated: data.updated_at,
            completed: data.closed_at
          },
          status: (function (data) {
            switch (data.state) {
              case 'open':
                return 'incomplete';
                break;
              case 'closed':
                return 'complete';
                break;
            }
          })(data)
        }
      };
      return SCSF.merge(github);
    }
  }]);

  return Github;
})();

module.exports = Github;