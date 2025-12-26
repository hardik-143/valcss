# ValCSS Complete Reference

A comprehensive guide to all utilities, values, and syntax patterns supported by ValCSS.

## Core Syntax Patterns

| Pattern            | Description                          | Example                                       |
| ------------------ | ------------------------------------ | --------------------------------------------- |
| `property-[value]` | Arbitrary values with bracket syntax | `p-[20px]`, `w-[100%]`                        |
| `_` for spaces     | Use underscore to represent spaces   | `m-[10px_20px]`, `border-[1px_solid_#000]`    |
| Functions          | Support for CSS functions            | `calc(100%_-_20px)`, `clamp(1rem,_2vw,_2rem)` |
| Direct values      | Predefined values without brackets   | `block`, `flex`, `relative`, `absolute`       |

## Length Units & Values

| Type           | Valid Values                          | Example                   |
| -------------- | ------------------------------------- | ------------------------- |
| **Pixels**     | `10px`, `20px`, `-5px`                | `p-[10px]`                |
| **Relative**   | `1rem`, `2em`, `1.5em`                | `text-[1.2rem]`           |
| **Percentage** | `50%`, `100%`, `25%`                  | `w-[100%]`                |
| **Viewport**   | `100vh`, `50vw`, `10vh`               | `h-[100vh]`               |
| **Functions**  | `calc()`, `clamp()`, `min()`, `max()` | `w-[calc(100%_-_20px)]`   |
| **Numbers**    | `0`, `1`, `2.5`, `-10`                | `z-[10]`, `opacity-[0.5]` |

## Spacing Utilities

| Utility      | CSS Property         | Directions  | Example     |
| ------------ | -------------------- | ----------- | ----------- |
| **Padding**  | `padding`            |             |             |
| `p-[value]`  | `padding`            | All sides   | `p-[20px]`  |
| `px-[value]` | `padding-left/right` | Horizontal  | `px-[10px]` |
| `py-[value]` | `padding-top/bottom` | Vertical    | `py-[15px]` |
| `pt-[value]` | `padding-top`        | Top only    | `pt-[5px]`  |
| `pb-[value]` | `padding-bottom`     | Bottom only | `pb-[5px]`  |
| `pl-[value]` | `padding-left`       | Left only   | `pl-[5px]`  |
| `pr-[value]` | `padding-right`      | Right only  | `pr-[5px]`  |
| **Margin**   | `margin`             |             |             |
| `m-[value]`  | `margin`             | All sides   | `m-[20px]`  |
| `mx-[value]` | `margin-left/right`  | Horizontal  | `mx-[auto]` |
| `my-[value]` | `margin-top/bottom`  | Vertical    | `my-[10px]` |
| `mt-[value]` | `margin-top`         | Top only    | `mt-[20px]` |
| `mb-[value]` | `margin-bottom`      | Bottom only | `mb-[20px]` |
| `ml-[value]` | `margin-left`        | Left only   | `ml-[10px]` |
| `mr-[value]` | `margin-right`       | Right only  | `mr-[10px]` |

### Spacing Values

| Format       | Description              | Example                   |
| ------------ | ------------------------ | ------------------------- |
| Single value | Same for all sides       | `p-[10px]`                |
| Two values   | Top/bottom, left/right   | `p-[10px_20px]`           |
| Four values  | Top, right, bottom, left | `p-[10px_20px_30px_40px]` |

## Size Utilities

| Utility         | CSS Property | Example                  |
| --------------- | ------------ | ------------------------ |
| `w-[value]`     | `width`      | `w-[100px]`, `w-[50%]`   |
| `h-[value]`     | `height`     | `h-[200px]`, `h-[100vh]` |
| `max-w-[value]` | `max-width`  | `max-w-[500px]`          |
| `min-w-[value]` | `min-width`  | `min-w-[200px]`          |
| `max-h-[value]` | `max-height` | `max-h-[300px]`          |
| `min-h-[value]` | `min-height` | `min-h-[100px]`          |

## Positioning Utilities

| Utility          | CSS Property | Example            |
| ---------------- | ------------ | ------------------ |
| `top-[value]`    | `top`        | `top-[10px]`       |
| `left-[value]`   | `left`       | `left-[20px]`      |
| `right-[value]`  | `right`      | `right-[0]`        |
| `bottom-[value]` | `bottom`     | `bottom-[10px]`    |
| `pos-[value]`    | `position`   | `pos-[relative]`   |
| `z-[value]`      | `z-index`    | `z-[10]`, `z-[-1]` |

### Position Values

| Value      | Description                           |
| ---------- | ------------------------------------- |
| `static`   | Default positioning                   |
| `relative` | Relative to normal position           |
| `absolute` | Relative to nearest positioned parent |
| `fixed`    | Relative to viewport                  |
| `sticky`   | Sticky positioning                    |

## Text Utilities

| Utility            | CSS Property     | Valid Values                                                  | Example                        |
| ------------------ | ---------------- | ------------------------------------------------------------- | ------------------------------ |
| `text-[color]`     | `color`          | Hex, RGB, RGBA, named colors                                  | `text-[#000]`, `text-[red]`    |
| `text-[size]`      | `font-size`      | Length units                                                  | `text-[16px]`, `text-[1.2rem]` |
| `text-[align]`     | `text-align`     | `left`, `center`, `right`, `justify`                          | `text-[center]`                |
| `text-[transform]` | `text-transform` | `uppercase`, `lowercase`, `capitalize`, `none`                | `text-[uppercase]`             |
| `font-[weight]`    | `font-weight`    | `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900` | `font-[700]`                   |
| `lh-[value]`       | `line-height`    | Numbers or `normal`                                           | `lh-[1.5]`, `lh-[normal]`      |

## Background & Border Utilities

| Utility             | CSS Property       | Valid Values                              | Example                        |
| ------------------- | ------------------ | ----------------------------------------- | ------------------------------ |
| `bg-[color]`        | `background-color` | Hex, RGB, RGBA, named colors, `none`      | `bg-[#f0f0f0]`, `bg-[red]`     |
| `border-[width]`    | `border-width`     | Length units                              | `border-[2px]`                 |
| `border-[style]`    | `border-style`     | `solid`, `dashed`, `dotted`, `none`, etc. | `border-[solid]`               |
| `border-[color]`    | `border-color`     | Hex, RGB, RGBA, named colors              | `border-[#ccc]`                |
| `border-[combined]` | `border`           | Combined values with `_`                  | `border-[1px_solid_#000]`      |
| `radius-[value]`    | `border-radius`    | Length units or percentage                | `radius-[8px]`, `radius-[50%]` |
| `opacity-[value]`   | `opacity`          | 0 to 1                                    | `opacity-[0.5]`, `opacity-[1]` |

### Color Formats

| Format    | Example                               |
| --------- | ------------------------------------- |
| **Hex**   | `#000`, `#ffffff`, `#f0f`             |
| **RGB**   | `rgb(255,0,0)`, `rgb(0, 255, 0)`      |
| **RGBA**  | `rgba(255,0,0,0.5)`                   |
| **Named** | `red`, `blue`, `transparent`, `black` |

## Layout Utilities

| Utility           | CSS Property      | Valid Values                                    | Example                       |
| ----------------- | ----------------- | ----------------------------------------------- | ----------------------------- |
| `d-[value]`       | `display`         | `block`, `inline`, `flex`, `grid`, `none`, etc. | `d-[flex]`                    |
| `justify-[value]` | `justify-content` | `center`, `space-between`, `flex-start`, etc.   | `justify-[center]`            |
| `items-[value]`   | `align-items`     | `center`, `flex-start`, `stretch`, etc.         | `items-[center]`              |
| `flex-[value]`    | `flex`            | Flex shorthand values                           | `flex-[1]`, `flex-[1_0_auto]` |
| `gap-[value]`     | `gap`             | Length units                                    | `gap-[10px]`                  |
| `float-[value]`   | `float`           | `left`, `right`, `none`                         | `float-[left]`                |

### Display Values

| Value          | Description          |
| -------------- | -------------------- |
| `block`        | Block-level element  |
| `inline`       | Inline element       |
| `inline-block` | Inline block element |
| `flex`         | Flexbox container    |
| `grid`         | Grid container       |
| `hidden`       | Element is hidden    |
| `inline-flex`  | Inline flexbox       |
| `inline-grid`  | Inline grid          |

### Flexbox Values

| Property            | Values                                                                              |
| ------------------- | ----------------------------------------------------------------------------------- |
| **justify-content** | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` |
| **align-items**     | `stretch`, `flex-start`, `flex-end`, `center`, `baseline`                           |

## Direct Values (No Brackets)

| Category     | Values                                                      | Usage                    |
| ------------ | ----------------------------------------------------------- | ------------------------ |
| **Position** | `static`, `relative`, `absolute`, `fixed`, `sticky`         | `<div class="relative">` |
| **Display**  | `block`, `inline`, `inline-block`, `flex`, `grid`, `hidden` | `<div class="flex">`     |

## Variants & Modifiers

### Breakpoints (Responsive)

| Breakpoint | Default Size | Min-width Query    | Max-width Query       |
| ---------- | ------------ | ------------------ | --------------------- |
| `xs`       | 480px        | `xs:p-[20px]`      | `max-xs:p-[10px]`     |
| `sm`       | 640px        | `sm:text-[center]` | `max-sm:text-[left]`  |
| `md`       | 768px        | `md:flex`          | `max-md:block`        |
| `lg`       | 1024px       | `lg:w-[50%]`       | `max-lg:w-[100%]`     |
| `xl`       | 1280px       | `xl:p-[40px]`      | `max-xl:p-[20px]`     |
| `xxl`      | 1536px       | `xxl:text-[18px]`  | `max-xxl:text-[16px]` |

### Pseudo-states

| Variant     | CSS Pseudo-class | Example                         |
| ----------- | ---------------- | ------------------------------- |
| `hover:`    | `:hover`         | `hover:bg-[#000]`               |
| `focus:`    | `:focus`         | `focus:border-[2px_solid_blue]` |
| `active:`   | `:active`        | `active:scale-[0.95]`           |
| `visited:`  | `:visited`       | `visited:text-[purple]`         |
| `disabled:` | `:disabled`      | `disabled:opacity-[0.5]`        |

### Important Modifier

| Syntax     | Description              | Example                  |
| ---------- | ------------------------ | ------------------------ |
| `!utility` | Adds `!important` to CSS | `!m-[20px]`, `!bg-[red]` |

### Combined Variants

| Pattern                         | Description               | Example                     |
| ------------------------------- | ------------------------- | --------------------------- |
| `breakpoint:pseudo:utility`     | Responsive + pseudo-state | `md:hover:bg-[blue]`        |
| `breakpoint:!utility`           | Responsive + important    | `lg:!p-[30px]`              |
| `max-breakpoint:pseudo:utility` | Max-width + pseudo-state  | `max-md:hover:text-[white]` |

## Plugin System

### Adding Custom Utilities

```javascript
// valcss.config.js
plugins: [
  ({ addUtilities }) => {
    addUtilities(
      {
        "utility-name": {
          "css-property": "css-value",
          "another-property": "another-value",
        },
      },
      variants // optional: array of allowed variants or "*" for all
    );
  },
];
```

### Example Plugin

```javascript
plugins: [
  ({ addUtilities }) => {
    addUtilities(
      {
        "flex-center": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
        "text-shadow-sm": {
          "text-shadow": "1px 1px 2px rgba(0,0,0,0.1)",
        },
      },
      ["md", "hover", "lg"] // Only allow on md breakpoint, hover state, and lg breakpoint
    );
  },
];
```

### Variant Options

| Option            | Description            | Example                            |
| ----------------- | ---------------------- | ---------------------------------- |
| `"*"`             | Allow all variants     | All breakpoints and pseudo-states  |
| `["md", "hover"]` | Specific variants only | Only md breakpoint and hover state |
| `[]` or omit      | Base utility only      | No variants allowed                |

## Usage Examples

### Basic Utilities

```html
<div class="p-[20px] m-[10px] bg-[#f0f0f0] text-[16px]">Content</div>
```

### Complex Spacing

```html
<div class="p-[20px_30px] m-[10px_20px_30px_40px]">Multi-value spacing</div>
```

### Responsive Design

```html
<div class="w-[100%] md:w-[50%] lg:w-[33.333%]">Responsive width</div>
```

### Interactive States

```html
<button class="bg-[blue] hover:bg-[darkblue] active:bg-[navy]">
  Interactive button
</button>
```

### Complex Combinations

```html
<div
  class="
  p-[20px] 
  md:p-[30px] 
  lg:p-[40px]
  bg-[white] 
  hover:bg-[#f5f5f5]
  border-[1px_solid_#ddd] 
  hover:border-[1px_solid_#ccc]
  radius-[8px]
  !w-[calc(100%_-_40px)]
"
>
  Complex styled element
</div>
```

### Using Custom Plugin Utilities

```html
<div class="flex-center md:flex-center hover:flex-center">
  Centered with custom utility
</div>
```
