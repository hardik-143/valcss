const fs = require("fs");
const { validators, regex } = require("./validators");
const { stripComments } = require("./stripComments");
const {
  normalizeCalcExpression,
  normalizeCSSMath,
} = require("./normalizeCalcExpression");
const {
  pseudoPrefixes,
  positionValues,
  displayValues,
  inidividualConstants,
  spacingUtilsDirections,
  spacingUtilsProperties,
} = require("./constants");
const { getBreakpointConfig } = require("./getBreakpointConfig");
const { breakpoints } = getBreakpointConfig();
const { getUtilitiesMap } = require("./pluginEngine");

// const individualValues = [...positionValues, ...displayValues];

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
/**
 * Style map for position values.
 */
const positionStyleMap = createStyleMap("position", positionValues);

/**
 * Style map for display values.
 */
const displayStyleMap = createStyleMap("display", displayValues);

/**
 * Creates spacing utilities for a property.
 * @param {string} property - The property to create spacing utilities for.
 * @returns {Object} The spacing utilities.
 * @example
 * createSpacingUtils("padding") // creates padding utilities like p-[value], px-[value], py-[value], pt-[value], etc.
 * @description
 * - validate: Validates the value.
 * - generate: Generates the CSS for the value.
 */
function createSpacingUtils(property) {
  const utils = {};

  for (const key in spacingUtilsDirections) {
    const dirSuffix = key ? key : ""; // e.g., px, pt, etc.
    const classKey = spacingUtilsProperties[property] + dirSuffix; // p, px, pt...

    utils[classKey] = {
      validate: validators.spacingValues,
      generate: (val) => {
        let cssValue = normalizeCSSMath(val);
        let isOnlyDigit = regex.digit.test(cssValue);
        if (isOnlyDigit) {
          cssValue = `${parseFloat(cssValue)}px`;
        }

        if (spacingUtilsDirections[key][0] === "") {
          return `${property}: ${cssValue};`; // p or m
        }

        return spacingUtilsDirections[key]
          .map((d) => `${property}-${d}: ${cssValue};`)
          .join(" ");
      },
    };
  }

  return utils;
}

/**
 * Creates spacing utilities for padding and margin.
 */
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
      generate: (val) => `${cssProp}: ${normalizeCSSMath(val)};`,
    };
  }

  return utils;
}

/**
 * Creates size utilities for width, height, max-width, min-width, max-height, and min-height.
 */
const sizeUtils = createSizeUtils({
  w: "width",
  h: "height",
  "max-w": "max-width",
  "min-w": "min-width",
  "max-h": "max-height",
  "min-h": "min-height",
});

/**
 * Creates inset utilities for top, left, right, and bottom.
 */
const insetUtils = createSizeUtils({
  top: "top",
  left: "left",
  right: "right",
  bottom: "bottom",
});

/**
 * The main style map for generating CSS rules.
 */
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
 * Parses a utility-style class string and extracts its modifiers and base class.
 *
 * It detects:
 * - media prefixes (e.g. `sm`, `md`, `lg`)
 * - max-width modifiers (`max-*`)
 * - pseudo-class prefixes (e.g. `hover`, `focus`)
 * - important modifier (`!`)
 *
 * @param {string} fullClassName
 * The complete class string to parse.
 *
 * @returns {{
 *   mediaPrefix: string | null,
 *   isMax: boolean,
 *   pseudo: string | null,
 *   baseClass: string,
 *   cleanBaseClass: string,
 *   isImportant: boolean
 * }}
 * An object containing parsed class metadata.
 *
 * @example
 * parseClassString("md:hover:p-[10px]");
 * // {
 * //   mediaPrefix: "md",
 * //   isMax: false,
 * //   pseudo: "hover",
 * //   baseClass: "p-[10px]",
 * //   cleanBaseClass: "p-[10px]",
 * //   isImportant: false
 * // }
 *
 * @example
 * parseClassString("max-lg:focus:!text-red-500");
 * // {
 * //   mediaPrefix: "lg",
 * //   isMax: true,
 * //   pseudo: "focus",
 * //   baseClass: "!text-red-500",
 * //   cleanBaseClass: "text-red-500",
 * //   isImportant: true
 * // }
 */
function parseClassString(fullClassName) {
  const parts = fullClassName.split(":");
  const potentialBase = parts[parts.length - 1];

  let mediaPrefix = null;
  let isMax = false;
  let pseudo = null;

  /**
   * Check if first part is a media prefix
   * @example
   * "md:hover:p-[10px]" -> "md"
   * "max-lg:hover:p-[10px]" -> "max-lg"
   */
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

  /**
   * Check for pseudo prefixes in the middle parts
   * @example
   * "md:hover:p-[10px]" -> "hover"
   * "max-lg:active:p-[10px]" -> "active"
   */
  for (let i = mediaPrefix ? 1 : 0; i < parts.length - 1; i++) {
    const part = parts[i];

    if (breakpoints[part] || part.startsWith("max-")) {
      console.warn(
        `⚠️  Media prefix "${part}" must appear only as the first segment: "${fullClassName}"`
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

/**
 * Escapes special characters in a class name for CSS selectors.
 * @param {*} className
 * @returns
 * @example escapeClass("p-[10px]") // "p-\[10px\]"
 */
function escapeClass(className) {
  return className.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

function getCSSBodyFromStyles(styles) {
  return Object.entries(styles)
    .map(([prop, val]) => `${prop}: ${val};`)
    .join(" ");
}

/**
 * Generates the CSS from a class name.
 * @param {string} fullClassName - The full class name to generate the CSS from.
 * @returns {string} The generated CSS.
 */
function generateCSSFromClass(fullClassName, getCSSOnly = false) {
  const { mediaPrefix, isMax, pseudo, baseClass, cleanBaseClass, isImportant } =
    parseClassString(fullClassName);

  // console.log("Generating CSS for:", fullClassName, cleanBaseClass, getCSSOnly);
  let val = null;
  let rule = null;

  // console.log("Generating CSS for:", fullClassName, cleanBaseClass);
  if (inidividualConstants.includes(cleanBaseClass)) {
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

    // console.log("Generating plugin CSS for:", styles, pluginMatchKey);
    // console.log("variants", variants, mediaPrefix, pseudo, pluginMatchKey);
    // ✅ Always allow base class
    if (!mediaPrefix && !pseudo) {
      let cssBody = "";
      if (typeof styles === "string") {
        cssBody = styles
          .split(" ")
          .map((cls) => generateCSSFromClass(cls, true))
          .filter(Boolean)
          .join(" ");
        // console.log("cssBody", cssBody);
      } else if (typeof styles === "object" && !Array.isArray(styles)) {
        cssBody = getCSSBodyFromStyles(styles);
      }
      if(getCSSOnly) {
        return cssBody;
      }
      return `.${fullClassName} { ${cssBody} }`;
    }

    // ✅ Variant-specific classes
    if (
      (typeof variants === "string" && variants === "*") ||
      variants.includes("*") || // allow all variants
      (mediaPrefix && variants.includes(mediaPrefix)) ||
      (pseudo && variants.includes(pseudo))
    ) {
      let cssBody = "";
      if (typeof styles === "string") {
        cssBody = styles
          .split(" ")
          .map((cls) => generateCSSFromClass(cls, true))
          .filter(Boolean)
          .join(" ");
        // console.log("cssBody", cssBody);
      } else if (typeof styles === "object" && !Array.isArray(styles)) {
        cssBody = getCSSBodyFromStyles(styles);
      }
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

    if (getCSSOnly) {
      return cssValue;
    }
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
    // console.log("baseClass", baseClass);
    if (inidividualConstants.includes(baseClass)) return true; // direct match for values like "block", "flex", etc.

    const bracketed = cls.match(/^((?:[\w-]+:)*)(!?[\w-]+)-\[(.+)\]$/); // matches p-[10px], md:p-[10px], !bg-[red], hover:!m-[5px], etc.
    if (bracketed) return true;

    const utilitiesMap = getUtilitiesMap();
    let baseUtility = cls.split(":").pop();
    // console.log("Checking utility map for:", baseUtility, cls);
    if (utilitiesMap[baseUtility]) {
      return true;
    }

    if (baseUtility.startsWith("!") || baseUtility.startsWith("float")) {
      return true;
    }

    return false;
  });

  // console.log("filtered", filtered);

  const unique = [...new Set(filtered)];

  // console.log("Unique classes to process:", unique);
  return unique
    .map((cls) => generateCSSFromClass(cls, false))
    .filter(Boolean)
    .join("\n");
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

module.exports = { generateCombinedCSS, writeCSS, generateCSSFromClass };
