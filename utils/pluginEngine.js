const utilitiesMap = {};

/**
 * Add new utilities to the global utility map.
 */
// function addUtilities(newUtilities) {
//   Object.assign(utilitiesMap, newUtilities);
// }

function addUtilities(newUtilities, variants = []) {
//   console.log("adding utilities", newUtilities, variants);
  for (const className in newUtilities) {
    utilitiesMap[className] = {
      styles: newUtilities[className],
      variants,
    };
  }
}
/**
 * Get all collected utilities.
 */
function getUtilitiesMap() {
  return utilitiesMap;
}

/**
 * Reset all registered utilities (used in watch mode).
 */
function resetUtilitiesMap() {
  Object.keys(utilitiesMap).forEach((key) => delete utilitiesMap[key]);
}

module.exports = {
  addUtilities,
  getUtilitiesMap,
  resetUtilitiesMap,
};
