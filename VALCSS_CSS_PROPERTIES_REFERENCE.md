# ValCSS Supported CSS Properties and Values Reference

This document provides a comprehensive reference of all CSS properties supported by ValCSS framework, their accepted values, and usage examples.

## Table of Contents

- [Spacing Utilities](#spacing-utilities)
- [Size Utilities](#size-utilities)
- [Inset/Position Utilities](#insetposition-utilities)
- [Text Utilities](#text-utilities)
- [Background Utilities](#background-utilities)
- [Display and Layout](#display-and-layout)
- [Border Utilities](#border-utilities)
- [Position Utilities](#position-utilities)
- [Other Utilities](#other-utilities)
- [Plugin-defined Utilities](#plugin-defined-utilities)
- [Value Types Reference](#value-types-reference)
- [Modifiers and Variants](#modifiers-and-variants)

---

## Spacing Utilities

### Padding

| Class Pattern | CSS Property                    | Accepted Values                            | Examples                                                       |
| ------------- | ------------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| `p-[value]`   | `padding`                       | Length units, calc expressions, 1-4 values | `p-[10px]`, `p-[1rem]`, `p-[calc(100%-20px)]`, `p-[10px_20px]` |
| `px-[value]`  | `padding-left`, `padding-right` | Length units, calc expressions             | `px-[15px]`, `px-[2rem]`                                       |
| `py-[value]`  | `padding-top`, `padding-bottom` | Length units, calc expressions             | `py-[10px]`, `py-[1.5em]`                                      |
| `pt-[value]`  | `padding-top`                   | Length units, calc expressions             | `pt-[5px]`, `pt-[0.5rem]`                                      |
| `pr-[value]`  | `padding-right`                 | Length units, calc expressions             | `pr-[10px]`, `pr-[1rem]`                                       |
| `pb-[value]`  | `padding-bottom`                | Length units, calc expressions             | `pb-[15px]`, `pb-[2rem]`                                       |
| `pl-[value]`  | `padding-left`                  | Length units, calc expressions             | `pl-[20px]`, `pl-[1.25rem]`                                    |

### Margin

| Class Pattern | CSS Property                  | Accepted Values                            | Examples                                |
| ------------- | ----------------------------- | ------------------------------------------ | --------------------------------------- |
| `m-[value]`   | `margin`                      | Length units, calc expressions, 1-4 values | `m-[10px]`, `m-[auto]`, `m-[10px_20px]` |
| `mx-[value]`  | `margin-left`, `margin-right` | Length units, calc expressions             | `mx-[auto]`, `mx-[15px]`                |
| `my-[value]`  | `margin-top`, `margin-bottom` | Length units, calc expressions             | `my-[10px]`, `my-[1rem]`                |
| `mt-[value]`  | `margin-top`                  | Length units, calc expressions             | `mt-[5px]`, `mt-[0.5rem]`               |
| `mr-[value]`  | `margin-right`                | Length units, calc expressions             | `mr-[auto]`, `mr-[10px]`                |
| `mb-[value]`  | `margin-bottom`               | Length units, calc expressions             | `mb-[15px]`, `mb-[2rem]`                |
| `ml-[value]`  | `margin-left`                 | Length units, calc expressions             | `ml-[20px]`, `ml-[auto]`                |

---

## Size Utilities

| Class Pattern   | CSS Property | Accepted Values                | Examples                                                   |
| --------------- | ------------ | ------------------------------ | ---------------------------------------------------------- |
| `w-[value]`     | `width`      | Length units, calc expressions | `w-[100px]`, `w-[50%]`, `w-[100vw]`, `w-[calc(100%-20px)]` |
| `h-[value]`     | `height`     | Length units, calc expressions | `h-[200px]`, `h-[50vh]`, `h-[auto]`                        |
| `max-w-[value]` | `max-width`  | Length units, calc expressions | `max-w-[500px]`, `max-w-[90%]`                             |
| `min-w-[value]` | `min-width`  | Length units, calc expressions | `min-w-[100px]`, `min-w-[20%]`                             |
| `max-h-[value]` | `max-height` | Length units, calc expressions | `max-h-[300px]`, `max-h-[80vh]`                            |
| `min-h-[value]` | `min-height` | Length units, calc expressions | `min-h-[50px]`, `min-h-[10vh]`                             |

---

## Inset/Position Utilities

| Class Pattern    | CSS Property | Accepted Values                | Examples                             |
| ---------------- | ------------ | ------------------------------ | ------------------------------------ |
| `top-[value]`    | `top`        | Length units, calc expressions | `top-[10px]`, `top-[0]`, `top-[50%]` |
| `left-[value]`   | `left`       | Length units, calc expressions | `left-[20px]`, `left-[auto]`         |
| `right-[value]`  | `right`      | Length units, calc expressions | `right-[10px]`, `right-[0]`          |
| `bottom-[value]` | `bottom`     | Length units, calc expressions | `bottom-[15px]`, `bottom-[100%]`     |

---

## Text Utilities

| Class Pattern      | CSS Property     | Accepted Values                        | Examples                                                         |
| ------------------ | ---------------- | -------------------------------------- | ---------------------------------------------------------------- |
| `text-[color]`     | `color`          | Hex, RGB, RGBA, named colors           | `text-[#ff0000]`, `text-[rgb(255,0,0)]`, `text-[red]`            |
| `text-[size]`      | `font-size`      | Length units                           | `text-[16px]`, `text-[1.2rem]`, `text-[2em]`                     |
| `text-[align]`     | `text-align`     | left, right, center, justify           | `text-[left]`, `text-[center]`, `text-[right]`, `text-[justify]` |
| `text-[transform]` | `text-transform` | uppercase, lowercase, capitalize, none | `text-[uppercase]`, `text-[lowercase]`, `text-[capitalize]`      |
| `font-[weight]`    | `font-weight`    | 100-900                                | `font-[400]`, `font-[600]`, `font-[800]`                         |
| `lh-[value]`       | `line-height`    | Numbers, normal                        | `lh-[1.5]`, `lh-[2]`, `lh-[normal]`                              |

---

## Background Utilities

| Class Pattern | CSS Property       | Accepted Values              | Examples                                         |
| ------------- | ------------------ | ---------------------------- | ------------------------------------------------ |
| `bg-[color]`  | `background-color` | Hex, RGB, RGBA, named colors | `bg-[#ff0000]`, `bg-[rgb(255,0,0)]`, `bg-[blue]` |
| `bg-[none]`   | `background`       | none                         | `bg-[none]`                                      |
| `bg-[image]`  | `background`       | Any background value         | `bg-[url(image.jpg)]`                            |

---

## Display and Layout

### Display

| Class Pattern  | CSS Property | Accepted Values                                                         | Examples                                    |
| -------------- | ------------ | ----------------------------------------------------------------------- | ------------------------------------------- |
| `d-[value]`    | `display`    | block, inline, inline-block, flex, grid, none, inline-flex, inline-grid | `d-[block]`, `d-[flex]`, `d-[none]`         |
| Direct classes | `display`    | Same as above                                                           | `block`, `flex`, `grid`, `inline`, `hidden` |

### Flexbox & Grid

| Class Pattern     | CSS Property      | Accepted Values                                                         | Examples                                      |
| ----------------- | ----------------- | ----------------------------------------------------------------------- | --------------------------------------------- |
| `justify-[value]` | `justify-content` | flex-start, flex-end, center, space-between, space-around, space-evenly | `justify-[center]`, `justify-[space-between]` |
| `items-[value]`   | `align-items`     | stretch, flex-start, flex-end, center, baseline                         | `items-[center]`, `items-[flex-start]`        |
| `gap-[value]`     | `gap`             | Length units, calc expressions                                          | `gap-[10px]`, `gap-[1rem]`                    |
| `flex-[value]`    | `flex`            | Flex values                                                             | `flex-[1]`, `flex-[0_1_auto]`                 |

### Float

| Class Pattern   | CSS Property | Accepted Values   | Examples                                        |
| --------------- | ------------ | ----------------- | ----------------------------------------------- |
| `float-[value]` | `float`      | left, right, none | `float-[left]`, `float-[right]`, `float-[none]` |

---

## Border Utilities

| Class Pattern       | CSS Property    | Accepted Values                                                   | Examples                                                |
| ------------------- | --------------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| `border-[width]`    | `border-width`  | Length units                                                      | `border-[1px]`, `border-[2rem]`                         |
| `border-[style]`    | `border-style`  | none, solid, dashed, dotted, double, groove, ridge, inset, outset | `border-[solid]`, `border-[dashed]`                     |
| `border-[color]`    | `border-color`  | Hex, RGB, RGBA, named colors                                      | `border-[#000]`, `border-[red]`                         |
| `border-[combined]` | `border`        | Combined values (separated by \_)                                 | `border-[1px_solid_red]`, `border-[2px_dashed_#ff0000]` |
| `radius-[value]`    | `border-radius` | Length units, calc expressions                                    | `radius-[5px]`, `radius-[50%]`, `radius-[1rem]`         |

---

## Position Utilities

| Class Pattern  | CSS Property | Accepted Values                           | Examples                                            |
| -------------- | ------------ | ----------------------------------------- | --------------------------------------------------- |
| `pos-[value]`  | `position`   | static, relative, absolute, fixed, sticky | `pos-[relative]`, `pos-[absolute]`                  |
| Direct classes | `position`   | Same as above                             | `relative`, `absolute`, `fixed`, `static`, `sticky` |

---

## Other Utilities

| Class Pattern     | CSS Property | Accepted Values             | Examples                                         |
| ----------------- | ------------ | --------------------------- | ------------------------------------------------ |
| `opacity-[value]` | `opacity`    | 0-1 (decimals allowed)      | `opacity-[0.5]`, `opacity-[1]`, `opacity-[0.25]` |
| `z-[value]`       | `z-index`    | Numbers (positive/negative) | `z-[1]`, `z-[100]`, `z-[-1]`                     |

---

## Plugin-defined Utilities

ValCSS supports custom utilities defined through plugins in the configuration file. Examples from the default config:

| Class Name     | Generated CSS                                                  | Variants Supported |
| -------------- | -------------------------------------------------------------- | ------------------ |
| `flex-center`  | `display: flex; justify-content: center; align-items: center;` | md, hover, lg      |
| `flex-between` | Expands to `flex justify-[space-between] items-[flex-start]`   | md, hover, lg      |

---

## Value Types Reference

### Length Units

- **Pixels**: `10px`, `100px`, `-5px`
- **Relative units**: `1rem`, `2em`, `1.5rem`
- **Percentages**: `50%`, `100%`, `25%`
- **Viewport units**: `100vh`, `50vw`, `10vmin`, `20vmax`
- **Keywords**: `auto`, `inherit`, `initial`

### Calc Expressions

- **Basic calc**: `calc(100% - 20px)`
- **Clamp**: `clamp(1rem, 2.5vw, 2rem)`
- **Min/Max**: `min(100px, 50%)`, `max(1rem, 10px)`

### Color Values

- **Hex**: `#ff0000`, `#f00`, `#123456`
- **RGB**: `rgb(255, 0, 0)`, `rgb(123, 45, 67)`
- **RGBA**: `rgba(255, 0, 0, 0.5)`, `rgba(0, 0, 0, 0.8)`
- **Named colors**: `red`, `blue`, `transparent`, `black`, `white`

### Spacing Values (Special)

Spacing utilities support 1-4 values separated by underscores:

- **Single**: `10px` → all sides
- **Two values**: `10px_20px` → vertical_horizontal
- **Three values**: `10px_20px_15px` → top_horizontal_bottom
- **Four values**: `10px_20px_15px_25px` → top_right_bottom_left

---

## Modifiers and Variants

### Pseudo-class Modifiers

Supported pseudo-classes: `hover`, `focus`, `active`, `visited`, `disabled`, `enabled`, `empty`, `checked`

**Usage**: `hover:bg-[red]`, `focus:border-[blue]`, `active:opacity-[0.8]`

### Responsive Breakpoints

Default breakpoints can be overridden in config. Use with class prefixes:

- `sm:`, `md:`, `lg:`, `xl:` for min-width queries
- `max-sm:`, `max-md:`, `max-lg:`, `max-xl:` for max-width queries

**Usage**: `md:w-[50%]`, `max-lg:hidden`, `sm:hover:bg-[blue]`

### Important Modifier

Use `!` prefix for `!important` declarations:
**Usage**: `!bg-[red]`, `hover:!text-[white]`

### Combining Modifiers

Modifiers can be combined with colons:
**Usage**: `md:hover:!bg-[red]`, `max-lg:focus:border-[2px_solid_blue]`

---

## Notes

1. **Missing Flex Regex**: The validators.js file references `regex.flex` but this regex is not defined. This may cause flex utilities to fail validation.

2. **Custom Properties**: Additional CSS properties can be added through the plugin system in the configuration file.

3. **Value Validation**: All values are validated using regular expressions before CSS generation. Invalid values will result in warnings and no CSS output.

4. **Underscore Replacement**: In border utilities and other compound values, underscores (`_`) are replaced with spaces in the final CSS output.

5. **Plugin Variants**: Plugin-defined utilities can specify which variants (responsive breakpoints, pseudo-classes) they support. Using unsupported variants will result in warnings.
