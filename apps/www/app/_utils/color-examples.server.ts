import {
  type CssColor,
  generateColorSchemes,
  type SemanticColorNames,
} from '@digdir/designsystemet/internal';

/** Base colors for the example scales on the colors page */
const sampleColors = {
  red: '#F45F69',
  orange: '#EF8332',
  yellow: '#EAB43F',
  green: '#11801F',
  teal: '#00AEC6',
  blue: '#0062BA',
  purple: '#6527A6',
} as const satisfies Record<string, CssColor>;

export type SampleColorName = keyof typeof sampleColors;

type StepHexes = Record<SemanticColorNames, CssColor>;

export type ColorExample = {
  name: SampleColorName;
  light: StepHexes;
  dark: StepHexes;
};

const toHexes = (scale: Record<SemanticColorNames, { hex: CssColor }>) =>
  Object.fromEntries(
    Object.entries(scale).map(([step, color]) => [step, color.hex]),
  ) as StepHexes;

/**
 * Generates the example color scales on the server (at build time when prerendering),
 * so the color generator isn't shipped to the browser. Only hex values are returned.
 */
export const getColorExamples = (): ColorExample[] =>
  Object.entries(sampleColors).map(([name, hex]) => {
    const { light, dark } = generateColorSchemes(hex);
    return {
      name: name as SampleColorName,
      light: toHexes(light),
      dark: toHexes(dark),
    };
  });

/** Only pages that use the color example components need the data */
export const usesColorExamples = (mdx: string) =>
  /<(ColorSwatches|ColorScaleOverview)\b/.test(mdx);
