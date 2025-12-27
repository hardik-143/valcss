let config = null;

/**
 * Sets the config object.
 * @param {*} c
 */
function setConfig(c) {
  config = c;
}

/**
 * Gets the config object.
 * @returns {*} The config object.
 */
function getConfig() {
  if (!config) {
    throw new Error("Config not initialized. Call setConfig(config) first.");
  }
  return config;
}

module.exports = {
  setConfig,
  getConfig,
};
