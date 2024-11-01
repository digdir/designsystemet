import { type HTMLAttributes, forwardRef } from 'react';
import type { DefaultProps } from '../../../types';

import { Label } from '../../Label/Label';

export type FieldsetLegendProps = HTMLAttributes<HTMLLegendElement> &
  DefaultProps;

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
