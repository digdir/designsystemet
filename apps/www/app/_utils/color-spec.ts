import {
  type SemanticColorNames,
  semanticColorSpec,
} from '@digdir/designsystemet/internal';

type SpecStep = (typeof semanticColorSpec)[SemanticColorNames];

/** Every step in a color scale, in the order of the color spec */
export const specSteps: SpecStep[] = Object.values(semanticColorSpec);

/** The groups the steps are divided into, in the order of the color spec */
export const specGroups: SpecStep['group'][] = [
  ...new Set(specSteps.map((step) => step.group)),
];
