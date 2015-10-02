var SCSF = require('../scsf');
var trello = require('node-trello');

class Trello {
  constructor(integration) {
    if (!('key' in integration)) {
      throw new Error('missing integration.key');
    }
    if (!('token' in integration)) {
      throw new Error('missing integration.token');
    }
    if (!('board_id' in integration)) {
      throw new Error('missing integration.board_id');
    }
    this.integration = integration;
    this.headers = {
        'User-Agent': 'Tuddy',
        'Content-Type': 'application/json'
    };
  }
  /**
   * Pulls card data from Trello
   */
  pull() {
    return new Promise((resolve, reject) => {
      let stories = [];
      var t = new trello(this.integration.key, this.integration.token);
      t.get(`/1/boards/${this.integration.board_id}/cards/all`, function(err, data){
        if (err) {
          return reject(err);
        }
        data.forEach((card) => {
          stories.push(Trello.toSCSF(card));
        });
        return resolve(stories);
      });
    });
  }
  /**
   * Pushes cad data to toTrello
   *
   * @param stories
   */
  push(stories) {
    return Promise.all(stories.map((story) => {
      var t = new trello(this.integration.key, this.integration.token);
      var data = Trello.toTrello(story);
      data.idList = this.integration.idList;
      return new Promise((resolve, reject) => {
        return t.post('/1/cards', data, (err, body) => {
          if (err) {
            return reject(err);
          }
          return resolve(Trello.toSCSF(body));
        });
      });
    }));
  }
  /**
   * Convert SCSF data to Trello format
   */
  static toTrello(input) {
    var merged = SCSF.merge({ data: input });
    var data = merged.data;
    return {
        name: data.name,
        shortLink: data.key,
        url: data.url,
        desc: data.description,
        shortUrl: data.short_url,
        email: data.email,
        due: data.date.due,
        dateLastActivity: data.date.updated,
        closed: (function(data){
          if (data.status == 'complete') {
            return true;
          } else {
            return false;
          }
        })(data)
    }
  }
  /**
   * Converts Trello data to SCSF format
   */
  static toSCSF(data) {
    var trello = {
      meta: {
        source: {
          name: 'trello',
          data: data
        }
      },
      data: {
        id: data.id,
        key: data.shortLink,
        url: data.url,
        name: data.name,
        description: data.desc,
        short_url: data.shortUrl,
        email: data.email,
        date: {
          due: data.due,
          updated: data.dateLastActivity
        },
        status: (function(data) {
          switch (data.closed) {
            case false:
              return 'incomplete';
              break;
            case true:
              return 'complete';
              break;
          }
        })(data)
      }
    }
    return SCSF.merge(trello);
  }
}

module.exports = Trello
