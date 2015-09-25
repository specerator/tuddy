'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('lodash');

var SCSF = (function () {
  function SCSF() {
    _classCallCheck(this, SCSF);
  }

  _createClass(SCSF, null, [{
    key: 'merge',
    value: function merge(data) {
      var schema = SCSF.schema();
      return _.merge(schema, data);
    }
  }, {
    key: 'schema',
    value: function schema() {
      return {
        meta: {
          source: {
            id: null,
            name: null,
            key: null,
            data: null
          }
        },
        data: {
          id: null,
          self: null,
          key: null,
          name: null,
          description: null,
          type: null,
          url: null,
          archived: null,
          status: null,
          email: null,
          short_url: null,
          date: {
            start: null,
            end: null,
            due: null,
            created: null,
            updated: null,
            completed: null,
            deleted: null
          },
          lists: [],
          labels: [],
          project: {
            id: null
          },
          document: {
            id: null,
            range: null
          },
          users: []
        }
      };
    }
  }]);

  return SCSF;
})();

module.exports = SCSF;