import React, {
  forwardRef,
  type ButtonHTMLAttributes,
  RefAttributes,
} from 'react';
import type { ReactNode } from 'react';
import cn from 'classnames';
import classes from './Chips.module.css';
import type { ToggleChipsType } from './Toggle';
import ToggleChip from './Toggle';
import type { RemovableChipsProps, RemovableChipsType } from './Removable';
import RemovableChip from './Removable';

interface ChipsComponent
  extends React.ForwardRefExoticComponent<
    ChipsProps & React.RefAttributes<HTMLUListElement>
  > {
  Removable: RemovableChipsType;
  Toggle: ToggleChipsType;
}

export const chipsSize = ['xsmall', 'small'] as const;
type ChipsSize = typeof chipsSize[number];

export interface ChipsProps extends React.HTMLAttributes<HTMLUListElement> {
  size?: ChipsSize;
  children: React.ReactNode;
}

export const Chips = forwardRef<HTMLUListElement, ChipsProps>(
  ({ className, size = 'xsmall', children, ...rest }, ref) => (
    <ul
      {...rest}
      ref={ref}
      className={cn(className, classes.chips, classes[size])}
    >
      {React.Children.map(children, (chip, index) => {
        return <li key={index + (chip?.toString() ?? '')}>{chip}</li>;
      })}
    </ul>
  ),
) as ChipsComponent;

Chips.Toggle = ToggleChip;
Chips.Removable = RemovableChip;

export default Chips;

Chips.displayName = 'chips';
