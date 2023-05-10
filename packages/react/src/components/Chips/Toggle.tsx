import React, { forwardRef, useState } from 'react';
import cn from 'classnames';
import { CheckmarkIcon } from '@navikt/aksel-icons';

//import { SortIcon } from '../Table/SortIcon';

import classes from './Chips.module.css';

export interface ToggleChipsProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  size?: string;
  selected?: boolean;
}

export type ToggleChipType = React.ForwardRefExoticComponent<
  ToggleChipsProps & React.RefAttributes<HTMLButtonElement>
>;

const ToggleChip: ToggleChipType = forwardRef(
  ({ children, className, onClick, ...rest }, ref) => {
    const [selected, setSelectedState] = useState(false);

    const onClickFunctions = () => {
      selected ? setSelectedState(false) : setSelectedState(true);
      () => onClick;
    };
    return (
      <li>
        <button
          ref={ref}
          {...rest}
          onClick={() => onClickFunctions()}
          className={cn(
            className,
            classes.chip,
            classes.toggle,
            classes.buttonText,
            selected && classes.active,
          )}
        >
          <div className={classes.content}>
            {selected && (
              <span className={cn(classes.checkmark)}>
                <CheckmarkIcon
                  title='a11y-title'
                  fontSize='20px'
                  className={classes.icon}
                />
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
