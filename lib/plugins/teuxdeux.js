var SCSF = require('../scsf');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = require('request');
request.get = Promise.promisify(request.get, request);
request.post = Promise.promisify(request.post, request);
request.put = Promise.promisify(request.put, request);

var request = request.defaults({jar: true});

class Teuxdeux {
  constructor(integration) {
    if (!('username' in integration)) {
      throw new Error('missing integration.user');
    }
    if (!('password' in integration)) {
      throw new Error('missing integration.pass');
    }
    this.loginOperation = null;
    this.integration = integration;
    this.headers = {
      'User-Agent': 'Tuddy',
      'Content-Type': 'application/json'
    }
  }
  /**
  * Private method to ensure that login occurs before another action
  * @return {[type]} [description]
  */
  _login() {
    var self = this;
    if (!self.loginOperation) {
      return self.loginOperation = request.get({ url: 'https://teuxdeux.com/login'}).spread(function(res, body){
        var $ = cheerio.load(body);
        self.integration.authenticity_token = $('input[name=authenticity_token]').val();
      }).then(function(){
        return request.post({ url: 'https://teuxdeux.com/login', form: self.integration }).spread(function(res, body){
          return true;
        });
      });
    }
    return self.loginOperation;
  }
  /**
  * Retrieves stories from remote integration
  * @return {array} array of stories retrieved from remote integration
  */
  pull() {
    return this._login().then(() => {
      return request.get({
        url: 'https://teuxdeux.com/api/v1/todos/calendar',
        json: true,
        headers: { 'x-csrf-token': this.integration.authenticity_token }
      }).spread((res, body) => {
        var stories = [];
        body.forEach((story) => {
          stories.push(Teuxdeux.toSCSF(story));
        });
        return stories;
      });
    });
  }
  /**
  * Creates stories at remote integration
  * @param  {array} stories array of stories to create
  * @return {array} array of stories that were created
  */
  push(stories) {
    var out = [];
    return this._login().then(() => {
      return Promise.all(stories.map((story) => {
        var data = Teuxdeux.toTeuxdeux(story);
        return request.post({
          url: 'https://teuxdeux.com/api/v1/todos',
          form: data,
          json: true,
          headers: { 'x-csrf-token': this.integration.authenticity_token }
        }).spread((res, body) => {
          out.push(Teuxdeux.toSCSF(body));
        });
      })).then(() => {
        return out;
      });
    });
  }
  /**
  * Converts SCSF to data to source format
  * @param  {object} data SCSF data
  * @return {object}      source data
  */
  static toTeuxdeux(input) {
    var merged = SCSF.merge({ data: input });
    var data = merged.data;
    return {
      id: data.id,
      text: data.name,
      uuid: data.key,
      done: (function(data){
        if (data.status == 'complete') {
          return true;
        } else {
          return false;
        }
      })(data),
      current_date: data.date.start || new Date(),
      created_at: data.date.created,
      updated_at: data.date.updated
    }
  }
  /**
  * Converts source data to SCSF format
  * @param  {object} data source data
  * @return {object}      transformed SCSF data
  */
  static toSCSF(data) {
    var teuxdeux = {
      meta: {
        source: {
          name: 'teuxdeux',
          data: data
        }
      },
      data: {
        id: data.id,
        key: data.uuid,
        name: data.text,
        status: (function(data){
          if (data.done == true) {
            return 'complete';
          } else {
            return 'incomplete';
          }
        })(data),
        date: {
          start: data.current_date,
          created: data.created_at,
          updated: data.updated_at
        }
      }
    }
    return SCSF.merge(teuxdeux);
  }
}

module.exports = Teuxdeux;
