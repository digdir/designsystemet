import React, { forwardRef, useState } from 'react';
import cn from 'classnames';
import { CheckmarkIcon } from '@navikt/aksel-icons';

//import { SortIcon } from '../Table/SortIcon';

import classes from './Chips.module.css';

export interface ToggleChipsProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: string;
  /**
   * Toggles aria-pressed and visual-changes
   */
  selected?: boolean;
}

export type ToggleChipType = React.ForwardRefExoticComponent<
  ToggleChipsProps & React.RefAttributes<HTMLButtonElement>
>;

const ToggleChip: ToggleChipType = forwardRef(
  ({ className, children, selected, ...rest }, ref) => {
    return (
      <li>
        <button
          ref={ref}
          {...rest}
          className={cn(
            className,
            classes.chip,
            classes.toggle,
            selected && classes.active,
          )}
          aria-pressed={selected}
        >
          <div className={cn(classes.content)}>
            {selected && (
              <span className={classes.checkmark}>
                <CheckmarkIcon aria-hidden />
              </span>
            )}
            <div>{children}</div>
          </div>
        </button>
      </li>
    );
  },
);

ToggleChip.displayName = 'ToggleChip';

export default ToggleChip;
