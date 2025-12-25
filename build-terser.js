#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

async function transpileValcss() {
  const distDir = path.join(__dirname, "dist");

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  // Read the main valcss.js file
  const mainFile = path.join(__dirname, "valcss.js");
  const code = fs.readFileSync(mainFile, "utf8");

  // Minify with terser
  const minified = await minify(code, {
    compress: {
      drop_console: false, // keep console for CLI functionality
      drop_debugger: true,
      passes: 2,
      unsafe: true,
    },
    mangle: {
      toplevel: true,
      properties: false, // don't mangle properties to avoid breaking require/module access
    },
    format: {
      comments: false,
      beautify: false,
    },
  });

  if (minified.error) {
    throw minified.error;
  }

  // Write minified file to dist
  const distFile = path.join(distDir, "valcss.js");
  fs.writeFileSync(distFile, minified.code);
  fs.chmodSync(distFile, "755");

  // Copy utils directory to dist
  const utilsDir = path.join(__dirname, "utils");
  const distUtilsDir = path.join(distDir, "utils");

  if (!fs.existsSync(distUtilsDir)) {
    fs.mkdirSync(distUtilsDir);
  }

  const utilFiles = fs.readdirSync(utilsDir).filter((f) => f.endsWith(".js"));
  for (const file of utilFiles) {
    const utilCode = fs.readFileSync(path.join(utilsDir, file), "utf8");
    const minifiedUtil = await minify(utilCode, {
      compress: {
        drop_console: false,
        drop_debugger: true,
        passes: 2,
      },
      mangle: {
        toplevel: false,
        properties: false,
      },
      format: {
        comments: false,
        beautify: false,
      },
    });

    if (minifiedUtil.error) {
      throw minifiedUtil.error;
    }

    fs.writeFileSync(path.join(distUtilsDir, file), minifiedUtil.code);
  }

  const originalSize = code.length;
  const minifiedSize = minified.code.length;
  const savings = (
    ((originalSize - minifiedSize) / originalSize) *
    100
  ).toFixed(1);

  console.log(`✅ Transpiled valcss.js with terser`);
  console.log(
    `📦 Main file: ${originalSize} → ${minifiedSize} bytes (${savings}% smaller)`
  );
}

if (require.main === module) {
  transpileValcss().catch(console.error);
}

module.exports = { transpileValcss };
