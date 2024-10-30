import { forwardRef } from 'react';

import { Label, type LabelProps } from '../../Label/Label';

export type FieldsetLegendProps = LabelProps;

export const FieldsetLegend = forwardRef<
  HTMLLegendElement,
  FieldsetLegendProps
>(function FieldsetLegend({ children, ...rest }, ref) {
  return (
    <Label asChild {...rest}>
      <legend ref={ref}>{children}</legend>
    </Label>
  );
});
