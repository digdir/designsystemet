import {
  type SemanticColorNames,
  semanticColorSpec,
} from '@digdir/designsystemet/internal';

const specSteps = Object.values(semanticColorSpec);

/** The minimum contrast the color spec requires between two steps, if any */
export const getMinContrast = (
  a: SemanticColorNames,
  b: SemanticColorNames,
) => {
  const ratios = [
    ...(semanticColorSpec[a].minContrast ?? []).filter(({ against }) =>
      against.includes(b),
    ),
    ...(semanticColorSpec[b].minContrast ?? []).filter(({ against }) =>
      against.includes(a),
    ),
  ].map(({ ratio }) => ratio);
  return ratios.length > 0 ? Math.max(...ratios) : undefined;
};

/** Every step that one of `steps` has a contrast requirement against, in scale order */
export const getContrastTargets = (steps: SemanticColorNames[]) =>
  specSteps
    .filter(({ name }) =>
      steps.some((step) =>
        semanticColorSpec[step].minContrast?.some(({ against }) =>
          against.includes(name),
        ),
      ),
    )
    .map(({ name }) => name);

/** The steps used for text and borders, in scale order */
export const textAndBorderSteps = specSteps
  .filter(({ group }) => group === 'border' || group === 'text')
  .map(({ name }) => name);

export type ContrastLevel = 'AAA' | 'AA' | 'AA18' | 'DECO';

/** The WCAG level a contrast ratio between text and background reaches */
export const getContrastLevel = (contrast: number): ContrastLevel => {
  if (contrast < 3) return 'DECO';
  if (contrast < 4.5) return 'AA18';
  if (contrast < 7) return 'AA';
  return 'AAA';
};
