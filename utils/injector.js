const fs = require("fs");
const path = require("path");
const { writeCSS } = require("./cssGenerator");
const { getHeaderComment } = require("./getHeaderComment");

/**
 * Injects the CSS into the HTML file.
 * @param {Object} options - The options object.
 * @param {string} options.css - The CSS to inject.
 * @param {string} options.outputPath - The path to the output file.
 * @param {string} options.mode - The mode to use for injection.
 * @param {string[]} options.targets - The targets to inject the CSS into.
 */
function injectCSSIntoHTML({
  css = "",
  outputPath = "valcss-main.css",
  mode = "link",
  targets = [],
}) {
  let finalCSS = "";
  if (mode === "inline") {
    finalCSS = css;
  } else if (mode === "link") {
    finalCSS = getHeaderComment() + css;
  }

  targets.forEach((htmlFile) => {
    if (!fs.existsSync(htmlFile)) {
      console.warn(`⚠️ Target HTML file not found: ${htmlFile}`);
      return;
    }

    if (css === "") {
      console.error("❌ No CSS provided.");
      process.exit(1);
    }

    if (outputPath === "") {
      console.error("❌ No output path provided.");
      process.exit(1);
    }

    if (mode === "") {
      console.error("❌ No mode provided.");
      process.exit(1);
    }

    let html = fs.readFileSync(htmlFile, "utf8");

    if (mode === "inline") {
      const styleTag = `<style>\n${finalCSS}\n</style>`;
      if (!html.includes(styleTag)) {
        html = html.replace(/<\/head>/i, `${styleTag}\n</head>`);
        console.log(`✅ Inlined styles into ${htmlFile}`);
      }
    } else if (mode === "link") {
      // const relativePath = path.relative(path.dirname(htmlFile), outputPath);
      // const linkTag = `<link rel="stylesheet" href="${relativePath}">`;

      // ✅ Ensure CSS file exists (create it if missing)
      if (!fs.existsSync(outputPath)) {
        fs.writeFileSync(
          outputPath,
          "/* valcss: empty stylesheet created */\n"
        );
        console.log(`📝 Created missing CSS file: ${outputPath}`);
      }

      writeCSS(outputPath, finalCSS);
      // ✅ Inject link tag if not already present
      // if (!html.includes(linkTag)) {
      //   html = html.replace(/<\/head>/i, `${linkTag}\n</head>`);
      //   console.log(`✅ Linked CSS into ${htmlFile}`);
      // }
    }

    fs.writeFileSync(htmlFile, html, "utf8");
  });
}

module.exports = { injectCSSIntoHTML };
