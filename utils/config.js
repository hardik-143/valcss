const fs = require("fs");
const path = require("path");

/**
 * Loads the config file from the current directory.
 * @returns {Object} The config object.
 */
function loadConfig() {
  const configCandidates = [
    path.resolve("valcss.config.js"),
    path.resolve("valcss.config.json"),
  ];

  const configPath = configCandidates.find(fs.existsSync);

  if (!configPath) {
    throw new Error(
      "valcss.config.js or valcss.config.json not found. \n\nRun 'npx valcss init' to create a default config."
    );
  }

  let config;
  try {
    config = require(configPath);
  } catch (err) {
    throw new Error(
      `Failed to load config at ${configPath}: ${err.message}`
    );
  }

  if (!config.files || config.files.length === 0 || !Array.isArray(config.files)) {
    throw new Error("'files' array missing or invalid in config.");
  }

  return config;
}

module.exports = { loadConfig };
