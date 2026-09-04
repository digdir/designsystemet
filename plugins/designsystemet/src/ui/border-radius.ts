import type { BorderRadiusConfig } from '@digdir/designsystemet/tokens/types';

// Evaluates the border-radius step formulas of a theme (e.g. `min({base}*0.5,{scale})`)
// to pixel values, keyed by step name. A step whose formula cannot be evaluated is null.
//
// The generated tokens keep the formulas as token math and let Figma/Style Dictionary
// resolve them; the preview evaluates them here so it needs no token resolver.
export function resolveBorderRadiusSteps(
  borderRadius: BorderRadiusConfig,
): Record<string, number | null> {
  const values: Record<string, number | null> = {};
  for (const [step, formula] of Object.entries(borderRadius.steps)) {
    values[step] = evaluateFormula(
      formula
        .replaceAll('{base}', String(borderRadius.base))
        .replaceAll('{scale}', String(borderRadius.scale)),
    );
  }
  return values;
}

const formulaFunctions = {
  min: Math.min,
  max: Math.max,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
};

function evaluateFormula(expression: string): number | null {
  // Only numbers, arithmetic and the function names above may remain after substitution.
  if (
    !/^[0-9+\-*/().,\s]*(?:(?:min|max|floor|ceil|round)[0-9+\-*/().,\s]*)*$/.test(
      expression,
    )
  ) {
    return null;
  }

  try {
    const fn = new Function(
      ...Object.keys(formulaFunctions),
      `return (${expression});`,
    ) as (...args: Array<(...values: number[]) => number>) => unknown;
    const result = fn(...Object.values(formulaFunctions));
    return typeof result === 'number' && Number.isFinite(result)
      ? result
      : null;
  } catch {
    return null;
  }
}
