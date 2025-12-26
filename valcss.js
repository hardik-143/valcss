#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { loadConfig } = require("./utils/config");
const { setConfig, getConfig } = require("./utils/configCache");
const { addUtilities, resetUtilitiesMap } = require("./utils/pluginEngine");
const args = process.argv.slice(2); // remove the first two args (node and the script path)

// --------------------- INIT COMMAND ---------------------
if (args[0] === "init") {
  const configPath = "valcss.config.js";
  if (fs.existsSync(configPath)) {
    console.warn("⚠️  valcss.config.js already exists.");
    process.exit(1);
  }

  const defaultConfig = `
// valcss.config.js
module.exports = {
  files: ["index.html", "src/**/*.html"],
  output: "valcss-main.css",
  inject: {
    mode: "link", // "inline" or "link"
    targets: ["index.html"]
  }
};`;

  fs.writeFileSync(configPath, defaultConfig.trimStart());
  console.log("✅ valcss.config.js created!");
  process.exit(0);
}
// --------------------- INIT COMMAND ---------------------

resetUtilitiesMap();
const __CONFIG = loadConfig();
if (Array.isArray(__CONFIG.plugins)) {
  __CONFIG.plugins.forEach((plugin) => {
    if (typeof plugin === "function") {
      plugin({ addUtilities });
    }
  });
}
setConfig(__CONFIG); // cache it globally
const { resolveFiles } = require("./utils/fileResolver");
const { generateCombinedCSS } = require("./utils/cssGenerator");
const { injectCSSIntoHTML } = require("./utils/injector");

let cliOutputPath = null; // output file path
let watchMode = false; // watch mode
let dryMode = false; // dry mode
let validArgs = ["--output", "--watch", "-w", "--dry-run", "--help", "-h"];

if (
  args.some(
    (arg) =>
      !validArgs.includes(arg) &&
      !args[args.indexOf(arg) - 1]?.includes("--output")
  )
) {
  console.error(
    `❌ Invalid argument: ${args.find(
      (arg) =>
        !validArgs.includes(arg) &&
        !args[args.indexOf(arg) - 1]?.includes("--output")
    )}`
  );
  process.exit(1);
}
// --------------------- DRY MODE ---------------------
if (args.includes("--dry-run") && args[0] === "--dry-run") dryMode = true;
// --------------------- DRY MODE ---------------------

// --------------------- HELP COMMAND ---------------------
if (args.length === 1 && (args[0] === "--help" || args[0] === "-h")) {
  console.log(`
------------------------------------------------------

📦 valcss - Utility CSS Extractor

Usage:
  valcss                 Uses valcss.config.json
  valcss --output <file> Override output file
  valcss --watch         Watch input files and regenerate CSS on changes
  valcss --dry-run      Output CSS to console without writing files
  valcss --help          Show this help message

Options:
  --output <file>        Write final CSS to given file
  --watch | -w          Enable watch mode
  --help | -h           Show this help message

------------------------------------------------------
`);
  process.exit(0);
}
// --------------------- HELP COMMAND ---------------------

// --------------------- ARGUMENT PARSING ---------------------

if (args.includes("--watch") || args.includes("-w")) watchMode = true;

if (args.includes("--output")) {
  const i = args.indexOf("--output");
  if (i !== -1 && args[i + 1]) {
    cliOutputPath = args[i + 1];
  } else {
    console.error("❌ Missing value for --output");
    process.exit(1);
  }
}
// --------------------- ARGUMENT PARSING ---------------------

// --------------------- MAIN BUILD FUNCTION ---------------------
function buildCSS() {
  try {
    const {
      files: patterns,
      output: configOutput = "valcss-main.css",
      inject,
    } = getConfig();

    const resolvedFiles = resolveFiles(patterns); // get all the files that match the patterns
    if (resolvedFiles.length === 0) {
      // if no files are found, exit
      console.error("❌ No matching files found.");
      return;
    }

    const finalOutputPath = cliOutputPath || configOutput; // get the output path
    console.log(`📝 Generating CSS for ${resolvedFiles.length} files...`);
    const css = generateCombinedCSS(resolvedFiles); // generate the css

    if (dryMode) {
      console.log(`
------------------------------------------------------
DRY MODE ENABLED
------------------------------------------------------\n\n`);
      console.log(css);
      console.log(`\n------------------------------------------------------`);
      return;
    }

    if (inject && Array.isArray(inject.targets)) {
      // if inject targets are found, inject the css into the html
      injectCSSIntoHTML({
        css,
        outputPath: finalOutputPath,
        mode: inject.mode || "link",
        targets: inject.targets,
      });
    } else {
      console.error("❌ No inject targets found.");
    }
  } catch (err) {
    console.error(`❌ ${err.message}`);
  }
}
// --------------------- MAIN BUILD FUNCTION ---------------------

// --------------------- EXECUTION MODE ---------------------

if (watchMode) {
  try {
    const { files: patterns } = getConfig();
    const resolvedFiles = resolveFiles(patterns);

    console.log("👀 Watching files for changes...");
    chokidar.watch(resolvedFiles).on("change", (changedPath) => {
      console.log(`🔄 File changed: ${changedPath}`);
      buildCSS();
    });

    buildCSS(); // Initial run
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
} else {
  buildCSS();
}
// --------------------- EXECUTION MODE ---------------------
