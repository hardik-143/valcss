const { validators, regex } = require("./validators");
const { stripComments } = require("./stripComments");
const { normalizeCalcExpression } = require("./normalizeCalcExpression");
const {
  pseudoPrefixes,
  positionValues,
  displayValues,
} = require("./constants");
const { getBreakpointConfig } = require("./getBreakpointConfig");
const { breakpoints } = getBreakpointConfig();
const { getUtilitiesMap } = require("./pluginEngine");

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
      validate: validators.spacingValues,
      generate: (val) => {
        let cssValue = normalizeCalcExpression(val);
        let isOnlyDigit = regex.digit.test(cssValue);
        if (isOnlyDigit) {
          cssValue = `${parseFloat(cssValue)}px`;
        }
        cssValue = cssValue.replaceAll("_", " ");

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
  ...sizeUtils,
  ...insetUtils,
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

      let isColor = validators.color(val);
      if (isColor) {
        return `border-color: ${val};`;
      }
      return `border: ${val.replaceAll("_", " ")};`;
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
  opacity: {
    validate: validators.opacity,
    generate: (val) => `opacity: ${val};`,
  },
  z: { validate: validators.zIndex, generate: (val) => `z-index: ${val};` },
  flex: {
    validate: validators.flex,
    generate: (val) => `flex: ${val};`,
  },
  ...positionStyleMap,
  ...displayStyleMap,
};

/**
 * Parses the class string and returns the media prefix, isMax, pseudo, baseClass, cleanBaseClass, and isImportant.
 * @param {string} fullClassName - The full class name to parse.
 * @description checks for media prefix, isMax, pseudo, baseClass, cleanBaseClass, and isImportant.
 * @returns {Object} The parsed class string.
 */
function parseClassString(fullClassName) {
  const parts = fullClassName.split(":");
  const potentialBase = parts[parts.length - 1];

  let mediaPrefix = null;
  let isMax = false;
  let pseudo = null;

  // max-bp:p-[1px]
  // Only check first part for media
  const firstPart = parts[0];
  if (firstPart.startsWith("max-")) {
    const bp = firstPart.slice(4);
    if (breakpoints[bp]) {
      mediaPrefix = bp;
      isMax = true;
    }
  } else if (breakpoints[firstPart]) {
    mediaPrefix = firstPart;
    isMax = false;
  }

  // Check remaining parts for pseudo
  for (let i = mediaPrefix ? 1 : 0; i < parts.length - 1; i++) {
    const part = parts[i];

    if (breakpoints[part] || part.startsWith("max-")) {
      console.warn(
        `⚠️ Media prefix "${part}" must appear only as the first segment: "${fullClassName}"`
      );
    }
    if (pseudoPrefixes.includes(part)) {
      pseudo = part;
    }
  }

  const baseClass = potentialBase;
  const isImportant = baseClass.startsWith("!");
  const cleanBaseClass = isImportant ? baseClass.slice(1) : baseClass;
  return {
    mediaPrefix,
    isMax,
    pseudo,
    baseClass,
    cleanBaseClass,
    isImportant,
  };
}
function escapeClass(className) {
  return className.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

/**
 * Generates the CSS from a class name.
 * @param {string} fullClassName - The full class name to generate the CSS from.
 * @returns {string} The generated CSS.
 */
function generateCSSFromClass(fullClassName) {
  const { mediaPrefix, isMax, pseudo, baseClass, cleanBaseClass, isImportant } =
    parseClassString(fullClassName);

  // console.log("cleanBaseClass", cleanBaseClass, isMax, mediaPrefix);
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

  const utilitiesMap = getUtilitiesMap();
  const pluginMatchKey = cleanBaseClass;

  if (utilitiesMap[pluginMatchKey]) {
    const { styles, variants } = utilitiesMap[pluginMatchKey];

    console.log("variants", variants, mediaPrefix, pseudo, pluginMatchKey);
    // ✅ Always allow base class
    if (!mediaPrefix && !pseudo) {
      const cssBody = Object.entries(styles)
        .map(([prop, val]) => `${prop}: ${val};`)
        .join(" ");

      return `.${fullClassName} { ${cssBody} }`;
    }
    console.log("variants 23", variants, mediaPrefix, pseudo, pluginMatchKey);

    // ✅ Variant-specific classes
    if (
      (typeof variants === "string" && variants === "*") ||
      variants.includes("*") || // allow all variants
      (mediaPrefix && variants.includes(mediaPrefix)) ||
      (pseudo && variants.includes(pseudo))
    ) {
      const cssBody = Object.entries(styles)
        .map(([prop, val]) => `${prop}: ${val};`)
        .join(" ");

      let selector = `.${escapeClass(fullClassName)}`;
      if (pseudo) selector += `:${pseudo}`;

      let rule = `${selector} { ${cssBody} }`;

      if (mediaPrefix) {
        const px = breakpoints[mediaPrefix];
        const query = isMax
          ? `@media (max-width: ${px - 1}px)`
          : `@media (min-width: ${px}px)`;
        return `${query} {\n  ${rule}\n}`;
      }

      return rule;
    }

    // ⚠️ Variant is not allowed
    console.warn(`⚠️ Variant not allowed for: ${fullClassName}`);
    return null;
  }

  if (rule && rule.validate(val)) {
    let classSelector = escapeClass(fullClassName);

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

  // console.log("styleMap", styleMap);
  // console.log("classAttrMatches", classAttrMatches);
  const allClasses = classAttrMatches.flatMap((match) => {
    if (match && match[1]) {
      return match[1].trim().split(/\s+/);
    }
    return []; // safe fallback
  }); // get all the classes from the html content

  // console.log("allClasses", allClasses);
  const filtered = allClasses.filter((cls) => {
    const baseClass = cls.split(":").pop(); // handles md:block, etc.
    if (individualValues.includes(baseClass)) return true;

    const bracketed = cls.match(/^((?:[\w-]+:)*)(!?[\w-]+)-\[(.+)\]$/);
    if (bracketed) return true;

    const utilitiesMap = getUtilitiesMap();
    let baseUtility = cls.split(":").pop();
    if (utilitiesMap[baseUtility]) {
      return true;
    }

    return false;
  });

  // console.log("filtered", filtered);

  const unique = [...new Set(filtered)];

  return unique.map(generateCSSFromClass).filter(Boolean).join("\n");
}

/**
 * Generates the combined CSS from the file paths.
 * @param {string[]} filePaths - The file paths to generate the CSS from.
 * @returns {string} The combined CSS.
 */
function generateCombinedCSS(filePaths, fs) {
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
function writeCSS(outputPath, css, fs) {
  fs.writeFileSync(outputPath, css);
  console.log(`✅ CSS written to ${outputPath}`);
}

module.exports = { generateCombinedCSS, writeCSS };
