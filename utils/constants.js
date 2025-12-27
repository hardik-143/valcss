/**
 * CSS pseudo-class prefixes
 */
const pseudoPrefixes = [
  "hover",
  "focus",
  "active",
  "visited",
  "disabled",
  "enabled",
  "empty",
  "checked",
];

/**
 * CSS property values for position
 */
const positionValues = ["static", "relative", "absolute", "fixed", "sticky"];

/**
 * CSS property values for display
 */
const displayValues = [
  "block",
  "inline",
  "inline-block",
  "flex",
  "grid",
  "hidden",
  "inline-flex",
  "inline-grid",
];

/**
 * CSS property values for visibility
 */
const visibilityValues = ["visible", "invisible"];

const inidividualConstants = [...positionValues, ...displayValues];

/**
 * Directions for spacing utilities.
 */
const spacingUtilsDirections = {
  "": [""],
  x: ["left", "right"],
  y: ["top", "bottom"],
  t: ["top"],
  b: ["bottom"],
  l: ["left"],
  r: ["right"],
};

const spacingUtilsProperties = {
  padding: "p",
  margin: "m",
};

export {
  pseudoPrefixes,
  positionValues,
  displayValues,
  visibilityValues,
  inidividualConstants,
  spacingUtilsDirections,
  spacingUtilsProperties,
};
