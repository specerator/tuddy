'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');
var request = require('request');

request.get = Promise.promisify(request.get, request);
request.post = Promise.promisify(request.post, request);

var _url = require('url');

var Sprintly = (function () {
  function Sprintly(integration) {
    _classCallCheck(this, Sprintly);

    if (!('email' in integration)) {
      throw new Error('missing integration.email');
    }
    if (!('key' in integration)) {
      throw new Error('missing integration.key');
    }
    if (!('product' in integration)) {
      throw new Error('missing integration.product');
    }
    this.integration = integration;
    this.headers = {
      'User-Agent': 'Tuddy',
      'Authorization': 'Basic amVmZit0dWRkeUBsb2lzZWxsZXMuY29tOldIQ1J2eGRqRTZhcHRuQmZqWjgzWldhVlFFam43R2VG'
    };
  }

  _createClass(Sprintly, [{
    key: 'url',
    value: function url(data) {
      var endpoint = 'https://sprint.ly/api/products/' + this.integration.product + '/items.json';

      var parsed = _url.parse(endpoint, true);

      if (typeof data != 'undefined') {
        parsed.query = {};
        delete parsed.search;
        // if ('per_page' in data) {
        //   parsed.query.per_page = data.per_page;
        // }
        // if ('page' in data) {
        //   parsed.query.page = data.page;
        // }
        // if ('state' in data) {
        //   parsed.query.state = data.state;
        // }
      }
      return parsed.format(parsed);
    }
  }, {
    key: 'pull',
    value: function pull() {
      return request.get({ url: this.url(), headers: this.headers }).spread(function (res, body) {
        if (res.statusCode == 200) {
          return JSON.parse(body).map(Sprintly.toSCSF);
        } else {
          throw new Error(res.statusMessage);
        }
      });
      // return this._findAll({});
    }
  }, {
    key: 'push',
    value: function push(stories) {
      var _this = this;

      return Promise.all(stories.map(function (story) {
        console.log(Sprintly.toSprintly(story));
        var a = { url: _this.url(), headers: _this.headers, formData: Sprintly.toSprintly(story) };
        debugger;
        return request.post({ url: _this.url(), headers: _this.headers, form: Sprintly.toSprintly(story) }).spread(function (res, body) {
          debugger;
          if (res.statusCode == 200) {
            return JSON.parse(body).map(Sprintly.toSCSF);
          } else {
            throw new Error(res.statusMessage);
          }
        });
      }));
      // return new Promise((resolve, reject) => {
      //   var that = this;
      //   var out = [];
      //   async.each(stories, function(story, callback){
      //     var Sprintly = Sprintly.toSprintly(story);
      //     request.post({ url: that.url(), json: true, headers: that.headers, body: Sprintly }, function(err, response, body){
      //       if (err) {
      //         console.log(err);
      //         callback(new Error(err));
      //       }
      //       body.fk = body.id;
      //       body.id = story.id;
      //       out.push(body);
      //       callback();
      //     });
      //   }, function(err) {
      //     var stories = _.map(out, function(story){
      //       return Sprintly.toSCSF(story);
      //     });
      //     if (err) {
      //       return reject(err);
      //     }
      //     return resolve(stories);
      //   });
      // });
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
            console.log('Sprintly.findAll', query, response, body);
            body = [];
          }
          body.forEach(function (story) {
            story.fk = story.id;
            story.id = null;
            stories.push(Sprintly.toSCSF(story));
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
    key: 'toSprintly',
    value: function toSprintly(data) {
      return {
        title: data.name,
        // description: data.description,
        type: data.type
        // status: data.status
      };
    }

    /**
    * Converts Sprintly data to SCSF format
    * @param  {object} data Sprintly data
    * @return {object} SCSF object
    */
  }, {
    key: 'toSCSF',
    value: function toSCSF(data) {
      return {
        _source: 'sprintly',
        id: data.number,
        project: data.product.id,
        url: data.short_url,
        name: data.title,
        description: data.description,
        createdAt: data.created_at,
        updatedAt: data.last_modified,
        status: data.status,
        _data: data
      };
    }
  }]);

  return Sprintly;
})();

module.exports = Sprintly;