import {
  type ColorScale,
  type CssColor,
  generateColorSchemes,
  type SemanticColorNames,
  semanticColorSpec,
} from '@digdir/designsystemet/internal';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './color-examples.module.css';

/** Base colors for the example scales, generated the same way as in the Theme Builder */
const sampleColors = {
  red: '#F45F69',
  orange: '#EF8332',
  yellow: '#EAB43F',
  green: '#11801F',
  teal: '#00AEC6',
  blue: '#0062BA',
  purple: '#6527A6',
} as const satisfies Record<string, CssColor>;

type SampleColorName = keyof typeof sampleColors;

const sampleScales = Object.entries(sampleColors).map(([name, hex]) => ({
  name: name as SampleColorName,
  ...generateColorSchemes(hex),
}));

type Scheme = { light: ColorScale; dark: ColorScale };

/** CSS variables with the light and dark value of a step, used with `light-dark()` in the CSS */
const stepVars = (
  scheme: Scheme,
  property: 'bg' | 'fg' | 'border',
  step: SemanticColorNames,
) => ({
  [`--${property}-light`]: scheme.light[step].hex,
  [`--${property}-dark`]: scheme.dark[step].hex,
});

/** Which colors to show a step with, so it looks the way it is meant to be used */
const getSwatchVars = (
  scheme: Scheme,
  step: SemanticColorNames,
): CSSProperties => {
  switch (semanticColorSpec[step].group) {
    case 'border':
      return {
        ...stepVars(scheme, 'bg', 'surface-tinted'),
        ...stepVars(scheme, 'fg', 'text-default'),
        ...stepVars(scheme, 'border', step),
      };
    case 'text':
      return {
        ...stepVars(scheme, 'bg', 'background-default'),
        ...stepVars(scheme, 'fg', step),
      };
    case 'base':
      return step.startsWith('base-contrast')
        ? {
            ...stepVars(scheme, 'bg', 'base-default'),
            ...stepVars(scheme, 'fg', step),
          }
        : {
            ...stepVars(scheme, 'bg', step),
            ...stepVars(scheme, 'fg', 'base-contrast-default'),
          };
    default:
      return {
        ...stepVars(scheme, 'bg', step),
        ...stepVars(scheme, 'fg', 'text-default'),
      };
  }
};

type ColorSwatchesProps = {
  /** One row per step, showing the step in every example color scale */
  steps: SemanticColorNames[];
  caption?: string;
};

/**
 * Shows color steps in several color scales, generated live with the same code as the Theme Builder.
 * Follows the page's light or dark mode.
 */
export const ColorSwatches = ({ steps, caption }: ColorSwatchesProps) => {
  const { t } = useTranslation();

  return (
    <figure className={classes.figure}>
      <div className={classes.rows}>
        {steps.map((step) => (
          <div key={step} className={classes.row}>
            <code className={classes.rowLabel}>{step}</code>
            <div className={classes.swatches}>
              {sampleScales.map((scheme) => (
                <div
                  key={scheme.name}
                  className={classes.swatch}
                  data-group={semanticColorSpec[step].group}
                  style={getSwatchVars(scheme, step)}
                >
                  {t(`color-examples.colors.${scheme.name}`)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className={classes.caption}>{caption}</figcaption>
      )}
    </figure>
  );
};

const specSteps = Object.values(semanticColorSpec);
const groups = [...new Set(specSteps.map((step) => step.group))];

type ColorScaleOverviewProps = {
  /** The base color to generate the scale from */
  color: CssColor;
  caption?: string;
};

/**
 * Shows every step in a color scale, grouped like in the color spec.
 * Follows the page's light or dark mode.
 */
export const ColorScaleOverview = ({
  color,
  caption,
}: ColorScaleOverviewProps) => {
  const scheme = generateColorSchemes(color);

  return (
    <figure className={classes.figure}>
      <div className={classes.overview}>
        {groups.map((group) => (
          <div key={group} className={classes.group}>
            <div className={classes.groupLabel}>
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </div>
            <div className={classes.groupSteps}>
              {specSteps
                .filter((step) => step.group === group)
                .map(({ name }) => (
                  <div key={name} className={classes.step}>
                    <div
                      className={classes.stepColor}
                      style={stepVars(scheme, 'bg', name)}
                    />
                    <span className={classes.stepLabel}>
                      {name.replace(`${group}-`, '')}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className={classes.caption}>{caption}</figcaption>
      )}
    </figure>
  );
};
