import React, { forwardRef } from 'react';
import cn from 'classnames';
import classes from './Chips.module.css';
import type { ToggleChipType } from './Toggle/Toggle';
import ToggleChip from './Toggle/Toggle';
import type { RemovableChipType } from './Removable/Removable';
import RemovableChip from './Removable/Removable';

interface ChipsComponent
  extends React.ForwardRefExoticComponent<
    ChipsProps & React.RefAttributes<HTMLUListElement>
  > {
  Removable: RemovableChipType;
  Toggle: ToggleChipType;
}

export const chipsSize = ['xsmall', 'small'] as const;
type ChipsSize = typeof chipsSize[number];

export interface ChipsProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  /**
   * Changes padding and font-sizes.
   * @default small
   */
  size?: ChipsSize;
}

export const Chips = forwardRef<HTMLUListElement, ChipsProps>(
  ({ className, size = 'small', children, ...rest }, ref) => (
    <ul
      {...rest}
      ref={ref}
      className={cn(className, classes.chips, classes[size])}
    >
      {children}
    </ul>
  ),
) as ChipsComponent;

Chips.Toggle = ToggleChip;
Chips.Removable = RemovableChip;
Chips.displayName = 'Chips';

export default Chips;
