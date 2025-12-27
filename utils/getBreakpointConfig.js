const { getConfig } = require("./configCache");

const defaultBreakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

/**
 * Gets the breakpoint configuration by merging user-defined breakpoints with default breakpoints.
 * @returns 
 * {Object} An object containing the merged breakpoints and a function to get breakpoint values.
 */
function getBreakpointConfig() {
  const userConfig = getConfig();
  let userBreakpoints = userConfig.breakpoints || {};
  // check is userBReakPoints values are string or number, convert to number if string and also if has px at the end remove it
  Object.keys(userBreakpoints).forEach((key) => {
    let value = userBreakpoints[key];
    if (typeof value === "string") {
      if (value.endsWith("px")) {
        value = value.slice(0, -2);
      }
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        userBreakpoints[key] = numValue;
      } else {
        console.warn(
          `⚠️  Invalid breakpoint value for "${key}": ${userBreakpoints[key]}. Using default value "${defaultBreakpoints[key]}" instead.`
        );
        delete userBreakpoints[key];
      }
    }
  });
  const breakpoints = {
    ...defaultBreakpoints,
    ...userBreakpoints,
  };
  //   console.log("userConfig", userConfig.breakpoints, breakpoints);

  const getValue = (key) => breakpoints[key] || null;

  //   console.log("breakpoints", breakpoints);
  return {
    breakpoints,
    getValue,
  };
}

module.exports = {
  getBreakpointConfig,
  defaultBreakpoints,
};
