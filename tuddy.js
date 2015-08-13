function tuddy() {
  return new Client();
}

/**
 * Manages pushing, pulling, and syncing from multiple integrations
 */
class Client {
  /**
   *
   */
  constructor() {
    this.plugins = new Map();
    this.integrations = new Map();
  }
  /**
   *
   */
  addIntegration(integration) {
    var plugin = require(`./lib/plugins/${integration.type}`);
    var instance = new plugin(integration);
    this.plugins.set(integration.name, instance);
    this.integrations.set(integration.name, integration);
  }
  /**
   *
   */
  pull(integrationName) {
    let instance = this.plugins.get(integrationName);
    return instance.pull();
  }
  /**
   *
   */
  push(integrationName, stories) {
    let instance = this.plugins.get(integrationName);
    return instance.push(stories);
  }
  /**
   *
   */
  sync() {

  }
}

module.exports = tuddy;
