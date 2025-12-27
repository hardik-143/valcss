// /**
//  * Normalizes calc expressions.
//  * @param {string} value - The value to normalize.
//  * @returns {string} The normalized value.
//  * @example
//  * normalizeCalcExpression("calc(100%-50px+20px)") // "calc(100% - 50px + 20px)" - adds spaces around operators
//  * normalizeCalcExpression("10px") // "10px" - does not modify non-calc values
//  *
//  */
// function normalizeCalcExpression(value) {
//   if (!value.startsWith("calc(")) return value;

//   return value.replace(/calc\((.*?)\)/, (_, expr) => {
//     const spaced = expr
//       .replace(/_/g, "")
//       .replace(/([+-/*])/g, " $1 ") // add space around operators
//       .replace(/\s+/g, " ") // remove duplicate spaces
//       .trim();

//     return `calc(${spaced})`;
//   });
// }

// // clamp(200px, 40%, 400px)
// /**
//  * Normalizes clamp expressions.
//  * @param {string} value
//  * @returns {string} The normalized value.
//  * @example
//  * normalizeClampExpression("clamp(200px,40%+10px,400px)") // "clamp(200px, 40% + 10px, 400px)" - adds spaces around operators
//  */
// function normalizeClampExpression(value) {
//   if (!value.startsWith("clamp(")) return value;

//   return value.replace(/clamp\((.*?)\)/, (_, expr) => {
//     const spaced = expr
//       .replace(/_/g, "")
//       .replace(/([+-/*])/g, " $1 ") // add space around operators
//       .replace(/\s+/g, " ") // remove duplicate spaces
//       .trim();

//     return `clamp(${spaced})`;
//   });
// }

// function normalizeMinMaxExpression(value) {
//   if (!value.startsWith("min(") && !value.startsWith("max(")) return value;

//   return value.replace(/(min|max)\((.*?)\)/, (_, func, expr) => {
//     const spaced = expr
//       .replace(/_/g, "")
//       .replace(/([+-/*])/g, " $1 ") // add space around operators
//       .replace(/\s+/g, " ") // remove duplicate spaces
//       .trim();

//     return `${func}(${spaced})`;
//   });
// }

// module.exports = {
//   normalizeCalcExpression,
// };

/**
 * Adds spacing around math operators inside CSS math functions.
 * @param {string} expr
 * @returns {string}
 */
function normalizeExpression(expr) {
  return expr
    .replace(/_/g, "")
    .replace(/([+\-*/])/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes calc() expressions.
 * @param {string} value
 * @returns {string}
 */
function normalizeCalcExpression(value) {
  if (!value.startsWith("calc(")) return value;

  return value.replace(/calc\((.*?)\)/, (_, expr) => {
    return `calc(${normalizeExpression(expr)})`;
  });
}

/**
 * Normalizes clamp() expressions.
 * @param {string} value
 * @returns {string}
 */
function normalizeClampExpression(value) {
  if (!value.startsWith("clamp(")) return value;

  return value.replace(/clamp\((.*?)\)/, (_, expr) => {
    return `clamp(${normalizeExpression(expr)})`;
  });
}

/**
 * Normalizes min() and max() expressions.
 * @param {string} value
 * @returns {string}
 */
function normalizeMinMaxExpression(value) {
  if (!value.startsWith("min(") && !value.startsWith("max(")) return value;

  return value.replace(/(min|max)\((.*?)\)/, (_, func, expr) => {
    return `${func}(${normalizeExpression(expr)})`;
  });
}

/**
 * Global CSS math normalizer
 * Supports: calc(), min(), max(), clamp()
 * @param {string} value
 * @returns {string}
 */
function normalizeCSSMath(value) {
  if (typeof value !== "string") return value;

  return value
    .replace(/_/g, " ")
    .replace(
      /calc\((.*?)\)/g,
      (_, expr) => `calc(${normalizeExpression(expr)})`
    )
    .replace(
      /clamp\((.*?)\)/g,
      (_, expr) => `clamp(${normalizeExpression(expr)})`
    )
    .replace(
      /(min|max)\((.*?)\)/g,
      (_, func, expr) => `${func}(${normalizeExpression(expr)})`
    );
}

module.exports = {
  normalizeExpression,
  normalizeCalcExpression,
  normalizeClampExpression,
  normalizeMinMaxExpression,
  normalizeCSSMath,
};
