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
          card.fk = card.id;
          card.id = null;
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
      story.idList = this.integration.idList;
      return new Promise((resolve, reject) => {
        return t.post('/1/cards', Trello.toTrello(story), (err, body) => {
          if (err) {
            return reject(err);
          }
          body.fk = body.id;
          body.id = story.id;
          return resolve(Trello.toSCSF(body));
        });
      });
    }));
  }
  /**
   * Convert SCSF data to Trello format
   */
  static toTrello(data) {
    return {
        name: data.name,
        desc: data.description,
        idList: data.idList
    }
  }
  /**
   * Converts Trello data to SCSF format
   */
  static toSCSF(data) {
    return {
        _source: 'trello',
        id: data.id,
        fk: data.fk,
        url: data.url,
        name: data.name,
        description: data.desc,
        createdAt: null,
        updatedAt: data.dateLastActivity,
        completedAt: null,
        _data: data,
        status: (function(data){
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
}

module.exports = Trello
