/**
 * Function that returns an instance of client
 * @return {instance} Instance of client
 */
function tuddy() {
  return new Client();
}

/**
 * Manages pushing, pulling, and syncing from multiple integrations
 */
class Client {
  constructor() {
    this.plugins = new Map();
  }
  /**
   * Adds an integration by adding an instantiated plugin to the Map
   * @param {object} integration Integration name, type, and authentication info
   */
  addIntegration(integration) {
    try {
      var plugin = require(`./plugins/${integration.type}`);
    } catch (err) {
      throw new Error(`${integration.type} is not a valid plugin`);
    }
    this.plugins.set(integration.name, new plugin(integration));
  }
  /**
   * Returns an integration by name, throwing an error if it doesn't exist
   * @param  {string} integrationName Integration identifier
   * @return {instance} Instance of plugin
   */
  getIntegration(integrationName) {
    if (!this.plugins.has(integrationName)) {
      throw new Error(`"${integrationName}" is not a registered integration`);
    }
    return this.plugins.get(integrationName);
  }
  /**
   * Retrieve all stories from Integration
   * @param  {string} integrationName Integration identifier
   * @return {instance} Instance of plugin
   */
  pull(integrationName) {
    let instance = this.getIntegration(integrationName);
    return instance.pull();
  }
  /**
   * Creates all stories on integration
   * @param  {string} integrationName Integration identifier
   * @param  {array} stories Array of stories
   * @return {instance} Instance of plugin
   */
  push(integrationName, stories) {
    let instance = this.getIntegration(integrationName);
    return instance.push(stories);
  }
}

module.exports = tuddy;
