import type no from '../no/color-metadata';

/**
 * Translations for the color metadata we get from `@digdir/designsystemet/color`.
 *
 * The keys map to the semantic color names in `semanticColorSpec`.
 */
export default {
  'background-default': {
    long: 'Background Default is the most neutral background color.',
    short: 'Default background color.',
  },
  'background-tinted': {
    long: 'Background Tinted is a background color that has a hint of color in it.',
    short: 'Background with a hint of color.',
  },
  'surface-default': {
    long: 'Surface Default is used on surfaces that sit above the background colors. This is the most neutral surface color.',
    short: 'Default color for surfaces / components.',
  },
  'surface-tinted': {
    long: 'Surface Tinted is used on surfaces that sit above the background colors. This one has a hint of color in it.',
    short: 'Surfaces / components with a hint of color.',
  },
  'surface-hover': {
    long: 'Surface Hover is used on interactive surfaces that sit above the background colors in a hover state.',
    short: 'Hover color for surfaces / components.',
  },
  'surface-active': {
    long: 'Surface Active is used on interactive surfaces that sit above the background colors in an active state.',
    short: 'Active color for surfaces / components.',
  },
  'border-subtle': {
    long: 'Border Subtle is the lightest border color and is used to separate elements from each other.',
    short: 'Border color with low contrast for decorative use (dividers).',
  },
  'border-default': {
    long: 'Border Default is a border color that is used when you want good contrast against the background colors.',
    short: 'Default border color for form components and meaningful elements.',
  },
  'border-strong': {
    long: 'Border Strong is the darkest border color and is used when you want a very clear and strong border.',
    short: 'Border color with high contrast for extra visibility.',
  },
  'text-subtle': {
    long: 'Text Subtle is the lightest text color and is used for text that should be a little less prominent, or to create variation in the typography.',
    short: 'Text and icon color with lower contrast.',
  },
  'text-default': {
    long: 'Text Default is the darkest text color and is used for text that should be the most prominent. This color should be used for most of the text on a page.',
    short: 'Text and icon color with high contrast and good visibility.',
  },
  'base-default': {
    long: "Base Default gets the same hex code as the color selected in the tool. It is often used on important elements and on surfaces that should capture the user's attention.",
    short: 'Default color for solid backgrounds.',
  },
  'base-hover': {
    long: 'Base Hover is used as the hover color on elements that use the Base Default color.',
    short: 'Hover color for solid backgrounds.',
  },
  'base-active': {
    long: 'Base Active is used as the active color on elements that use the Base Default color.',
    short: 'Active color for solid backgrounds.',
  },
  'base-contrast-subtle': {
    long: 'Contrast Subtle is used as an important, meaningful color on top of the Base Default color.',
    short: 'Color with good contrast against Base-default.',
  },
  'base-contrast-default': {
    long: 'Contrast Default is used as an important, meaningful color on top of all the Base colors.',
    short: 'Color with good contrast against Base-default and Base-hover.',
  },
} satisfies typeof no;
