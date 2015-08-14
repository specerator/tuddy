var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');
var request = require('request');

request.get = Promise.promisify(request.get, request);
request.post = Promise.promisify(request.post, request);

var url = require('url');

class Sprintly {
  constructor(integration) {
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
    }
  }
  url(data) {
    let endpoint = `https://sprint.ly/api/products/${this.integration.product}/items.json`;

    let parsed = url.parse(endpoint, true);

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
  pull() {
    return request.get({ url: this.url(), headers: this.headers }).spread((res, body) => {
      if (res.statusCode == 200) {
        return JSON.parse(body).map(Sprintly.toSCSF);
      } else {
        throw new Error(res.statusMessage);
      }
    });
    // return this._findAll({});
  }
  push(stories) {
    return Promise.all(stories.map((story) => {
      console.log(Sprintly.toSprintly(story));
      return request.post({ url: this.url(), headers: this.headers, json: true, body: Sprintly.toSprintly(story) }).spread((res, body) => {
        debugger;
        if (res.statusCode == 200) {
          return JSON.parse(body).map(Sprintly.toSCSF);
        } else {
          throw new Error(res.statusMessage);
        }
      })
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
  static toSprintly(data) {
    return {
      title: data.name,
      description: data.description,
      type: data.type,
      status: data.status
    }
  }
  /**
  * Converts Sprintly data to SCSF format
  * @param  {object} data Sprintly data
  * @return {object} SCSF object
  */
  static toSCSF(data) {
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
      _data: data,
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

    getData(query, function(){
      def.resolve(stories);
    });

    return def.promise;

  }
}

module.exports = Sprintly;
