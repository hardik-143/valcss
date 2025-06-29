// valcss.config.js
module.exports = {
  files: ["index.html", "src/**/*.html"],
  output: "valcss-main.css",
  inject: {
    mode: "link", // "inline" or "link"
    targets: ["index.html"],
  },
};
