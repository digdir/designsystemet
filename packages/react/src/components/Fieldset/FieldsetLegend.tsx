import { type HTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../types';

import { Label } from '../Label/Label';

export type FieldsetLegendProps = HTMLAttributes<HTMLLegendElement> &
  DefaultProps;

/**
 * FieldsetLegend component, used to display a legend for a fieldset.
 *
 * @example
 * <Fieldset.Legend>Skriv inn dine svar</Fieldset.Legend>
 */
export const FieldsetLegend = forwardRef<
  HTMLLegendElement,
  FieldsetLegendProps
>(function FieldsetLegend(rest, ref) {
  return (
    <Label asChild>
      <legend ref={ref} {...rest} />
    </Label>
  );
});
