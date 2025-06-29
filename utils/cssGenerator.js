const fs = require("fs");
const { validators, regex } = require("./validators");
const { stripComments } = require("./stripComments");
const { normalizeCalcExpression } = require("./normalizeCalcExpression");
const {
  pseudoPrefixes,
  breakpoints,
  positionValues,
  displayValues,
} = require("./constants");

const individualValues = [...positionValues, ...displayValues];

/**
 * Creates a style map for a property.
 * @param {string} property - The property to create a style map for.
 * @param {string[]} values - The values to create a style map for.
 * @description
 * - validate: Validates the value.
 * - generate: Generates the CSS for the value.
 * will be used to generate the CSS for the individual values
 * @returns {Object} The style map.
 */
function createStyleMap(property, values) {
  const map = {};
  for (const value of values) {
    map[value] = {
      validate: () => true,
      generate: (val) => `${property}: ${val};`,
    };
  }
  return map;
}

const positionStyleMap = createStyleMap("position", positionValues);
const displayStyleMap = createStyleMap("display", displayValues);

/**
 * Creates spacing utilities for a property.
 * @param {string} property - The property to create spacing utilities for.
 * @returns {Object} The spacing utilities.
 */
function createSpacingUtils(property) {
  const directions = {
    "": [""],
    x: ["left", "right"],
    y: ["top", "bottom"],
    t: ["top"],
    b: ["bottom"],
    l: ["left"],
    r: ["right"],
  };

  const utils = {};

  for (const key in directions) {
    const dirSuffix = key ? key : ""; // e.g., px, pt, etc.
    const classKey = property[0] + dirSuffix; // p, px, pt...

    utils[classKey] = {
      validate: validators.lengthUnit,
      generate: (val) => {
        const cssValue = normalizeCalcExpression(val);
        if (directions[key][0] === "") {
          return `${property}: ${cssValue};`; // p or m
        }

        return directions[key]
          .map((d) => `${property}-${d}: ${cssValue};`)
          .join(" ");
      },
    };
  }

  return utils;
}

const spacingUtils = {
  ...createSpacingUtils("padding"),
  ...createSpacingUtils("margin"),
};

/**
 * Creates size utilities for a property.
 * @param {Object} properties - The properties to create size utilities for.
 * @returns {Object} The size utilities.
 */
function createSizeUtils(properties) {
  const utils = {};

  for (const [key, cssProp] of Object.entries(properties)) {
    utils[key] = {
      validate: validators.lengthUnit,
      generate: (val) => `${cssProp}: ${normalizeCalcExpression(val)};`,
    };
  }

  return utils;
}

const sizeUtils = createSizeUtils({
  w: "width",
  h: "height",
  "max-w": "max-width",
  "min-w": "min-width",
  "max-h": "max-height",
  "min-h": "min-height",
});

const insetUtils = createSizeUtils({
  top: "top",
  left: "left",
  right: "right",
  bottom: "bottom",
});

const styleMap = {
  ...spacingUtils,
  text: {
    validate: (val) =>
      validators.color(val) ||
      validators.lengthUnit(val) ||
      validators.textAlign(val) ||
      validators.textTransform(val),
    generate: (val) =>
      validators.color(val)
        ? `color: ${val};`
        : validators.textAlign(val)
        ? `text-align: ${val};`
        : validators.textTransform(val)
        ? `text-transform: ${val};`
        : `font-size: ${val};`,
  },
  font: {
    validate: validators.fontWeight,
    generate: (val) => `font-weight: ${val};`,
  },
  lh: {
    validate: validators.lineHeight,
    generate: (val) => `line-height: ${val};`,
  },
  bg: {
    validate: validators.bg,

    generate: (val) => {
      const trimmed = val.trim().toLowerCase();

      const isColor =
        regex.hex.test(trimmed) ||
        regex.rgb.test(trimmed) ||
        regex.rgba.test(trimmed) ||
        regex.namedColor.test(trimmed);

      const property =
        trimmed === "none"
          ? "background"
          : isColor
          ? "background-color"
          : "background";
      return `${property}: ${val};`;
    },
  },
  ...sizeUtils,
  d: {
    validate: validators.display,
    generate: (val) => `display: ${val};`,
  },
  float: {
    validate: validators.float,
    generate: (val) => `float: ${val};`,
  },
  justify: {
    validate: validators.justify,
    generate: (val) => `justify-content: ${val};`,
  },
  items: {
    validate: validators.items,
    generate: (val) => `align-items: ${val};`,
  },
  gap: {
    validate: validators.lengthUnit,
    generate: (val) => `gap: ${normalizeCalcExpression(val)};`,
  },
  border: {
    validate: validators.border,
    generate: (val) => {
      const trimmed = val.trim().toLowerCase();

      if (/^-?\d+(\.\d+)?(px|em|rem)?$/.test(trimmed)) {
        return `border-width: ${val};`;
      }

      if (
        /^(none|solid|dashed|dotted|double|groove|ridge|inset|outset)$/.test(
          trimmed
        )
      ) {
        return `border-style: ${val};`;
      }

      return `border-color: ${val.replaceAll("_", " ")};`;
    },
  },
  radius: {
    validate: validators.lengthUnit,
    generate: (val) => `border-radius: ${normalizeCalcExpression(val)};`,
  },
  pos: {
    validate: validators.position,
    generate: (val) => `position: ${val};`,
  },
  ...insetUtils,
  opacity: {
    validate: validators.opacity,
    generate: (val) => `opacity: ${val};`,
  },
  z: { validate: validators.zIndex, generate: (val) => `z-index: ${val};` },
  ...positionStyleMap,
  ...displayStyleMap,
};

/**
 * Generates the CSS from a class name.
 * @param {string} fullClassName - The full class name to generate the CSS from.
 * @returns {string} The generated CSS.
 */
function generateCSSFromClass(fullClassName) {
  let mediaPrefix = null;
  let pseudo = null;
  let isMax = false;
  let baseClass = fullClassName;

  const parts = fullClassName.split(":");
  const potentialBase = parts[parts.length - 1];

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];

    if (part.startsWith("max-")) {
      const bp = part.slice(4);
      if (breakpoints[bp]) {
        mediaPrefix = bp;
        isMax = true;
      }
    } else if (breakpoints[part]) {
      mediaPrefix = part;
      isMax = false;
    } else if (pseudoPrefixes.includes(part)) {
      pseudo = part;
    }
  }

  baseClass = potentialBase;
  const isImportant = baseClass.startsWith("!");
  const cleanBaseClass = isImportant ? baseClass.slice(1) : baseClass;

  if (individualValues.includes(cleanBaseClass)) {
    // direct match like "block", "flex", "absolute", etc.
    val = cleanBaseClass;
    rule = styleMap[cleanBaseClass];
  } else {
    const match = cleanBaseClass.match(/^([\w-]+)-\[(.+)\]$/);
    if (match) {
      const propKey = match[1];
      const value = match[2];
      rule = styleMap[propKey];
      val = value;
    }
  }

  if (rule && rule.validate(val)) {
    let classSelector = fullClassName.replace(
      /([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,
      "\\$1"
    );

    let cssRule = `.${classSelector}`;
    if (pseudo) cssRule += `:${pseudo}`;

    let cssValue = rule.generate(val);
    if (isImportant) {
      cssValue = cssValue.slice(0, -1) + " !important;";
    }

    const declaration = `{ ${cssValue} }`;

    if (mediaPrefix) {
      const px = breakpoints[mediaPrefix];
      const query = isMax
        ? `@media (max-width: ${px - 1}px)`
        : `@media (min-width: ${px}px)`;
      return `${query} {\n  ${cssRule} ${declaration}\n}`;
    }

    return `${cssRule} ${declaration}`;
  } else {
    console.warn(`⚠️ Invalid class or value: ${fullClassName}`);
  }

  return null;
}

/**
 * Extracts and generates the CSS from the HTML content.
 * @param {string} htmlContent - The HTML content to extract the CSS from.
 * @returns {string} The generated CSS.
 */
function extractAndGenerateCSS(htmlContent) {
  const classAttrMatches = [
    ...htmlContent.matchAll(/class\s*=\s*["']([^"']+)["']/g),
  ]; // Extract all class names from class="" attributes

  const allClasses = classAttrMatches.flatMap((match) => {
    if (match && match[1]) {
      return match[1].trim().split(/\s+/);
    }
    return []; // safe fallback
  }); // get all the classes from the html content

  const filtered = allClasses.filter((cls) => {
    const baseClass = cls.split(":").pop(); // handles md:block, etc.
    if (individualValues.includes(baseClass)) return true;

    const bracketed = cls.match(/^((?:[\w]+:)*)(!?[\w-]+)-\[(.+)\]$/);
    if (bracketed) return true;

    return false;
  });

  const unique = [...new Set(filtered)];

  return unique.map(generateCSSFromClass).filter(Boolean).join("\n");
}

/**
 * Generates the combined CSS from the file paths.
 * @param {string[]} filePaths - The file paths to generate the CSS from.
 * @returns {string} The combined CSS.
 */
function generateCombinedCSS(filePaths) {
  let combined = "";
  filePaths.forEach((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const clean = stripComments(raw);
    const styles = extractAndGenerateCSS(clean);
    combined += styles + "\n";
  });

  return combined.trim();
}

/**
 * Writes the CSS to the output file.
 * @param {string} outputPath - The path to the output file.
 * @param {string} css - The CSS to write.
 */
function writeCSS(outputPath, css) {
  fs.writeFileSync(outputPath, css);
  console.log(`✅ CSS written to ${outputPath}`);
}

module.exports = { generateCombinedCSS, writeCSS };
