var _ = require('lodash');

class SCSF {
  static merge(data) {
    var schema = SCSF.schema();
    return _.merge(schema, data);
  }
  static schema() {
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
        lists: [

        ],
        labels: [

        ],
        project: {
          id: null
        },
	document: {
	  id: null,
	  range: null
	},
        users: [

        ]
      }
    }
  }
}

module.exports = SCSF;
