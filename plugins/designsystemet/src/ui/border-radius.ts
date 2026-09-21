import type { BorderRadiusConfig } from '@digdir/designsystemet/tokens/types';

/** Resolves the border-radius aliases into pixel values. */
export function resolveBorderRadiusSteps(
  borderRadius: BorderRadiusConfig,
): Record<string, string> {
  const steps: Record<string, string> = {};

  for (const [step, formula] of Object.entries(borderRadius.steps)) {
    const value = formula
      .replaceAll('{base}', `${borderRadius.base}px`)
      .replaceAll('{scale}', `${borderRadius.scale}px`);
    steps[step] = value;
  }

  return steps;
}
