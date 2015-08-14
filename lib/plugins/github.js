var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');
var request = require('request');
request.get = Promise.promisify(request.get, request);

var url = require('url');

class Github {
  constructor(integration) {
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
    }
  }
  url(data) {
    let user = this.integration.user;
    let repo = this.integration.repo;
    let access_token = this.integration.access_token;
    let endpoint = `https://api.github.com/repos/${user}/${repo}/issues?access_token=${access_token}`;

    let parsed = url.parse(endpoint, true);

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
  pull() {
    return this._findAll({ state: 'all' });
  }
  push(stories) {
    return new Promise((resolve, reject) => {
      var that = this;
      var out = [];
      async.each(stories, function(story, callback){
        var github = Github.toGithub(story);
        request.post({ url: that.url(), json: true, headers: that.headers, body: github }, function(err, response, body){
          if (err) {
            console.log(err);
            callback(new Error(err));
          }
          body.fk = body.id;
          body.id = story.id;
          out.push(body);
          callback();
        });
      }, function(err) {
        var stories = _.map(out, function(story){
          return Github.toSCSF(story);
        });
        if (err) {
          return reject(err);
        }
        return resolve(stories);
      });
    });
  }
  static toGithub(data) {
    return {
      name: data.name,
      description: data.description,
      story_type: "feature"
    }
  }
  /**
  * Converts Github data to SCSF format
  * @param  {object} data Github data
  * @return {object} SCSF object
  */
  static toSCSF(data) {
    return {
      _source: 'github',
      id: data.id,
      fk: data.fk,
      url: data.html_url,
      name: data.title,
      description: data.body,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      completedAt: data.completed_at,
      _data: data,
      status: (function(data){
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
  }
  _query(query) {
    let endpoint = query.url || this.url(query);
    return request.get({ url: endpoint, json: true, headers: this.headers }).spread(function(response, body){
      var next = null;
      if (response.headers['link']) {
        var link = response.headers['link'];
        link.replace(/<([^>]*)>;\s*rel="([\w]*)\"/g, function(m, uri, type) {
          if (type == 'next') {
            next = uri;
          }
        });
      }
      var page = {
        next: next
      };
      return [response, body, page];
    }).catch(function(err){
      return new Error(err);
    });
  }
  _findAll(query) {
    var stories = [];
    var that = this;

    function getData(query, callback) {
      that._query(query).spread(function (response, body, page) {
        if (body === undefined) {
          console.log('Github.findAll', query, response, body);
          body = [];
        }
        body.forEach(function (story) {
          story.fk = story.id;
          story.id = null;
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

    getData(query, function(){
      def.resolve(stories);
    });

    return def.promise;

  }
}

module.exports = Github;
