export type ColorScheme = 'light' | 'dark';
export type ColorNumber = SemanticColorMap[keyof SemanticColorMap];
export type SemanticColorNames = keyof SemanticColorMap;
export type SeverityColorNames = 'danger' | 'info' | 'success' | 'warning';

export const semanticColorMap = {
  'background-default': 1,
  'background-tinted': 2,
  'surface-default': 3,
  'surface-tinted': 4,
  'surface-hover': 5,
  'surface-active': 6,
  'border-subtle': 7,
  'border-default': 8,
  'border-strong': 9,
  'text-subtle': 10,
  'text-default': 11,
  'base-default': 12,
  'base-hover': 13,
  'base-active': 14,
  'base-contrast-subtle': 15,
  'base-contrast-default': 16,
} as const;

type SemanticColorMap = typeof semanticColorMap;

type SemanticColorMapping = {
  [K in keyof SemanticColorMap]: {
    name: K;
    number: SemanticColorMap[K];
  };
};

export type SemanticColorSpec = {
  [P in keyof SemanticColorMapping]: SemanticColorMapping[P] & ColorScaleStep<SemanticColorNames>;
};

export type ColorScaleStep<T> = {
  name: T;
  number: ColorNumber;
  displayName: string;
  group: 'background' | 'surface' | 'border' | 'text' | 'base';
  luminance: {
    light: number;
    dark: number;
  };
  /**
   * Contrast this step must meet against other steps in the same scale.
   * Omit when the step is decorative, or when its contrast depends on the chosen color.
   */
  minContrast?: ContrastRequirement[];
};

export type ContrastRequirement = {
  /** Minimum WCAG contrast ratio, e.g. 3 for non-text content (1.4.11) or 4.5 for text (1.4.3) */
  ratio: number;
  /** The steps this step must meet `ratio` against */
  against: SemanticColorNames[];
};

export type Color = ColorScaleStep<SemanticColorNames> & {
  hex: CssColor;
};

export type ColorScale = Record<SemanticColorNames, Color>;

export type ThemeInfo = {
  light: ColorScale;
  dark: ColorScale;
};

/**
 * Supported CSS colors in `designsystemet/color`
 */
export type CssColor = HexColor;

export type HexColor = `#${string}`;
// type Percent = `${number}%`;
// type Degrees = `${number}deg`;
// type OkLchColor = `oklch(${Percent} ${number} ${Degrees})`;
