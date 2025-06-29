const { getConfig } = require("./configCache");

const defaultBreakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};
function getBreakpointConfig() {
  const userConfig = getConfig();
  const breakpoints = {
    ...defaultBreakpoints,
    ...(userConfig.breakpoints || {}),
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
