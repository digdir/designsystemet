import { semanticColorSpec } from '@digdir/designsystemet/internal';

// Color steps are named by step: `<theme>/<color>/base-default` in Color scheme and `color/<color>/base-default` in
// Theme. Imports before that named them by number (`<theme>/<color>/12`, `color/<color>/12`), and had the named
// scales in Semantic, so files can still have them.

/** The step name for each step number, e.g. `12` → `base-default`. */
export const STEP_NAME_BY_NUMBER = new Map(
  Object.values(semanticColorSpec).map((step) => [
    String(step.number),
    step.name,
  ]),
);

/**
 * A color step named by number, e.g. `<theme>/<color>/12`, under its step name, `<theme>/<color>/base-default`.
 * Undefined if the name doesn't end in a step number.
 */
export function toNamedColorStep(variableName: string): string | undefined {
  const [, prefix, step] = /^(.+\/)([^/]+)$/.exec(variableName) ?? [];
  const stepName = step && STEP_NAME_BY_NUMBER.get(step);
  return prefix && stepName ? `${prefix}${stepName}` : undefined;
}

/** Whether a variable is a step of a color scale named by step, e.g. `color/accent/base-default`. */
export function isColorScaleName(variableName: string): boolean {
  const [group, , step, ...rest] = variableName.split('/');
  return (
    group === 'color' &&
    rest.length === 0 &&
    step !== undefined &&
    Object.hasOwn(semanticColorSpec, step)
  );
}
