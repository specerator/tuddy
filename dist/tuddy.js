/**
 * Function that returns an instance of client
 * @return {instance} Instance of client
 */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function tuddy() {
  return new Client();
}

/**
 * Manages pushing, pulling, and syncing from multiple integrations
 */

var Client = (function () {
  function Client() {
    _classCallCheck(this, Client);

    this.plugins = new Map();
  }

  /**
   * Adds an integration by adding an instantiated plugin to the Map
   * @param {object} integration Integration name, type, and authentication info
   */

  _createClass(Client, [{
    key: "addIntegration",
    value: function addIntegration(integration) {
      try {
        var plugin = require("./plugins/" + integration.type);
      } catch (err) {
        throw new Error(integration.type + " is not a valid plugin");
      }
      this.plugins.set(integration.name, new plugin(integration));
    }

    /**
     * Returns an integration by name, throwing an error if it doesn't exist
     * @param  {string} integrationName Integration identifier
     * @return {instance} Instance of plugin
     */
  }, {
    key: "getIntegration",
    value: function getIntegration(integrationName) {
      if (!this.plugins.has(integrationName)) {
        throw new Error("\"" + integrationName + "\" is not a registered integration");
      }
      return this.plugins.get(integrationName);
    }

    /**
     * Retrieve all stories from Integration
     * @param  {string} integrationName Integration identifier
     * @return {instance} Instance of plugin
     */
  }, {
    key: "pull",
    value: function pull(integrationName) {
      var instance = this.getIntegration(integrationName);
      return instance.pull();
    }

    /**
     * Creates all stories on integration
     * @param  {string} integrationName Integration identifier
     * @param  {array} stories Array of stories
     * @return {instance} Instance of plugin
     */
  }, {
    key: "push",
    value: function push(integrationName, stories) {
      var instance = this.getIntegration(integrationName);
      return instance.push(stories);
    }
  }]);

  return Client;
})();

module.exports = tuddy;