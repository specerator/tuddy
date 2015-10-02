'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SCSF = require('../scsf');
var trello = require('node-trello');

var Trello = (function () {
  function Trello(integration) {
    _classCallCheck(this, Trello);

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

  _createClass(Trello, [{
    key: 'pull',
    value: function pull() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var stories = [];
        var t = new trello(_this.integration.key, _this.integration.token);
        t.get('/1/boards/' + _this.integration.board_id + '/cards/all', function (err, data) {
          if (err) {
            return reject(err);
          }
          data.forEach(function (card) {
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
  }, {
    key: 'push',
    value: function push(stories) {
      var _this2 = this;

      return Promise.all(stories.map(function (story) {
        var t = new trello(_this2.integration.key, _this2.integration.token);
        var data = Trello.toTrello(story);
        data.idList = _this2.integration.idList;
        return new Promise(function (resolve, reject) {
          return t.post('/1/cards', data, function (err, body) {
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
  }], [{
    key: 'toTrello',
    value: function toTrello(input) {
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
        closed: (function (data) {
          if (data.status == 'complete') {
            return true;
          } else {
            return false;
          }
        })(data)
      };
    }

    /**
     * Converts Trello data to SCSF format
     */
  }, {
    key: 'toSCSF',
    value: function toSCSF(data) {
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
          status: (function (data) {
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
      };
      return SCSF.merge(trello);
    }
  }]);

  return Trello;
})();

module.exports = Trello;