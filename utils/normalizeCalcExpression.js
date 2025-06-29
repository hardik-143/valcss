/**
 * Normalizes calc expressions.
 * @param {string} value - The value to normalize.
 * @returns {string} The normalized value.
 */
function normalizeCalcExpression(value) {
  if (!value.startsWith("calc(")) return value;

  return value.replace(/calc\((.*?)\)/, (_, expr) => {
    const spaced = expr
      .replace(/([+-/*])/g, " $1 ") // add space around operators
      .replace(/\s+/g, " ") // remove duplicate spaces
      .trim();

    return `calc(${spaced})`;
  });
}

module.exports = {
  normalizeCalcExpression,
};
