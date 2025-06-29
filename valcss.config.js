// valcss.config.js
module.exports = {
  files: ["index.html", "src/**/*.html"],
  output: "valcss-main.css",
  inject: {
    mode: "link", // "inline" or "link"
    targets: ["index.html"],
  },
  breakpoints: {
    lg: 990,
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
          // "flex-between": "flex justify-[between] items-[start]",
        },
        ["hover", "md"]
      );
    },
  ],
};
