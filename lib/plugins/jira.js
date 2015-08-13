var JiraClient = require('jira-connector');

class Jira {
  constructor(integration) {
    if (!('host' in integration)) {
      throw new Error('missing integration.host');
    }
    if (!('username' in integration)) {
      throw new Error('missing integration.username');
    }
    if (!('password' in integration)) {
      throw new Error('missing integration.password');
    }
    this.integration = integration;
    this.headers = {

    }
    this.client = new JiraClient({
      host: this.integration.host,
      basic_auth: {
        username: this.integration.username,
        password: this.integration.password
      }
    });
  }
  push(stories) {
    return Promise.all(stories.map((story) => {
      return new Promise((resolve, reject) => {
        this.client.issue.createIssue({ fields: Jira.toJira(story) }, function(err, issue) {
          if (err) {
            return reject(err);
          }
          return resolve({
            id: issue.id,
            key: issue.key,
            url: issue.url
          });
        });
      });
    }));
  }
  /**
   * Retrieve stories from remote integration
   * @return {array} Stories retrieved from remote integration
   */
  pull() {
    return new Promise((resolve, reject) => {
      this.client.search.search({
      }, function(err, result) {
        if (err) {
          return reject(err);
        }
        return resolve(result.issues.map(Jira.toSCSF));
      });
    });
  }
  static toJira(data) {
    return {
      id: data.id,
      created: data.createdAt,
      updatedAt: data.updatedAt,
      duedate: data.due,
      summary: data.name,
      description: data.description,
      project: {
        id: data.project,
        key: data.project_key
      },
      issuetype: {
        name: data.type
      }
    }
  }
  static toSCSF(data) {
    return {
      _source: 'jira',
      id: data.id,
      project: data.fields.project.id,
      project_key: data.fields.project.key,
      name: data.fields.summary,
      description: data.fields.description,
      key: data.key,
      url: data.self,
      due: data.fields.duedate,
      createdAt: data.fields.created,
      updatedAt: data.fields.updated
    }
  }
}

module.exports = Jira;
