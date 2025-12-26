const { globSync } = require("glob");
const fs = require("fs");
/**
 * This function resolves the files from the patterns
 * @param {*} patterns - The patterns to resolve
 * @returns - The resolved files
 */
function resolveFiles(patterns) {
  const resolved = patterns.flatMap((pattern) => globSync(pattern));
  return [...new Set(resolved.filter((file) => fs.existsSync(file)))];
}

module.exports = { resolveFiles };
