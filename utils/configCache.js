let config = null;

function setConfig(c) {
  config = c;
}

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
