/**
 * Regular expressions for validating CSS values.
 * @description
 * - length: Validates length units
 * - calc: Validates calc expressions
 * - clamp: Validates clamp expressions
 * - min: Validates min expressions
 * - max: Validates max expressions
 */
const regex = {
  length: /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw)?$/,
  calc: /^calc\(.+\)$/,
  clamp: /^clamp\(.+\)$/,
  min: /^min\(.+\)$/,
  max: /^max\(.+\)$/,
  hex: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
  rgb: /^rgb\((\s*\d{1,3}\s*,){2}\s*\d{1,3}\s*\)$/,
  rgba: /^rgba\((\s*\d{1,3}\s*,){3}\s*(0|1|0?\.\d+)\)$/,
  namedColor: /^(transparent|[a-zA-Z]+)$/,
  fontWeight: /^(100|200|300|400|500|600|700|800|900)$/,
  normal: /^normal$/,
  none: /^none$/,
  textAlign: /^(left|right|center|justify)$/,
  textTransform: /^(uppercase|lowercase|capitalize|none)$/,
  display:
    /^(block|inline|inline-block|flex|grid|none|inline-flex|inline-grid)$/,
  justify:
    /^(flex-start|flex-end|center|space-between|space-around|space-evenly)$/,
  items: /^(stretch|flex-start|flex-end|center|baseline)$/,
  borderStyle: /^(none|solid|dashed|dotted|double|groove|ridge|inset|outset)$/,
  opacity: /^(0(\.\d+)?|1(\.0+)?)$/,
  digit: /^-?\d+$/,
  position: /^(static|relative|absolute|fixed|sticky)$/,
  float: /^(left|right|none)$/,
};

/**
 * Validators for CSS values.
 * @description
 * use regex to validate the values
 */
const validators = {
  lengthUnit: (val) =>
    regex.length.test(val) ||
    regex.calc.test(val) ||
    regex.clamp.test(val) ||
    regex.min.test(val) ||
    regex.max.test(val),

  color: (val) =>
    regex.hex.test(val) ||
    regex.rgb.test(val) ||
    regex.rgba.test(val) ||
    regex.namedColor.test(val),

  fontWeight: (val) => regex.fontWeight.test(val),

  lineHeight: (val) => regex.digit.test(val) || regex.normal.test(val),

  textAlign: (val) => regex.textAlign.test(val),

  textTransform: (val) => regex.textTransform.test(val),

  display: (val) => regex.display.test(val),

  justify: (val) => regex.justify.test(val),

  items: (val) => regex.items.test(val),

  border: (val) => {
    const trimmed = val.trim().toLowerCase();
    // Support compound values separated by underscore
    const parts = trimmed.split("_");

    return parts.every(
      (part) =>
        regex.length.test(part) ||
        regex.borderStyle.test(part) ||
        regex.hex.test(part) ||
        regex.rgb.test(part) ||
        regex.rgba.test(part) ||
        regex.namedColor.test(part)
    );
  },
  opacity: (val) => regex.opacity.test(val),

  zIndex: (val) => regex.digit.test(val),

  position: (val) => regex.position.test(val),

  bg: (val) => {
    const trimmed = val.trim().toLowerCase();
    return (
      regex.hex.test(trimmed) ||
      regex.rgb.test(trimmed) ||
      regex.none.test(trimmed) ||
      regex.namedColor.test(trimmed)
    );
  },

  float: (val) => regex.float.test(val),
};

export { validators, regex };
