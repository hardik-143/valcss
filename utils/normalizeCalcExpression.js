/**
 * Normalizes calc expressions.
 * @param {string} value - The value to normalize.
 * @returns {string} The normalized value.
 * @example
 * normalizeCalcExpression("calc(100%-50px+20px)") // "calc(100% - 50px + 20px)" - adds spaces around operators
 * normalizeCalcExpression("10px") // "10px" - does not modify non-calc values
 */
function normalizeCalcExpression(value) {
  if (!value.startsWith("calc(")) return value;

  return value.replace(/calc\((.*?)\)/, (_, expr) => {
    const spaced = expr
      .replace(/_/g, " ")
      .replace(/([+-/*])/g, " $1 ") // add space around operators
      .replace(/\s+/g, " ") // remove duplicate spaces
      .trim();

    return `calc(${spaced})`;
  });
}

module.exports = {
  normalizeCalcExpression,
};
