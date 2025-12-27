// valcss.config.js
module.exports = {
  files: ["index.html", "src/**/*.html", "demo.html"],
  output: "valcss-main.css",
  inject: {
    mode: "link", // "inline" or "link"
    targets: ["index.html", "demo.html"],
  },
  breakpoints: {
    lg: 990, // overriding default lg breakpoint
    md: "asd", // invalid breakpoint to test error handling
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities(
        {
          "flex-center": {
            display: "flex",
            "justify-content": "center",
            "align-items": "center",
          },

          // "flex-between": {
          //   display: "flex",
          //   "justify-content": "between",
          //   "align-items": "start",
          // },
          "flex-between": "flex justify-[space-between] items-[flex-start]",
        },
        ["md", "hover", "lg"]
      );
    },
  ],
};
