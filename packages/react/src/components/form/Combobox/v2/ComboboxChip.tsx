import type { DataHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import type { DefaultProps } from '../../../../types';
import { Chip } from '../../../Chip';

export type ComboboxChipProps = DataHTMLAttributes<HTMLDataElement> &
  DefaultProps;

export const ComboboxChip = forwardRef<HTMLDataElement, ComboboxChipProps>(
  function ComboboxChip(rest, ref) {
    return (
      <Chip.Removable asChild>
        <data ref={ref} {...rest} />
      </Chip.Removable>
    );
  },
);
