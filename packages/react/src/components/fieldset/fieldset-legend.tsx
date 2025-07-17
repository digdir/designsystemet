import { forwardRef, type HTMLAttributes } from 'react';
import type { DefaultProps } from '../../types';
import { Label } from '../label/label';

export type FieldsetLegendProps = HTMLAttributes<HTMLLegendElement> &
  DefaultProps;

/**
 * FieldsetLegend component, used to display a legend for a fieldset.
 *
 * @example
 * <FieldsetLegend>Skriv inn dine svar</FieldsetLegend>
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
