import { ReactNode, useState } from 'react';
import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import cn from 'classnames';
import classes from './Chips.module.css';
import { SortIcon } from '../Table/SortIcon';
import { CheckmarkIcon } from '@navikt/aksel-icons';

export interface ToggleChipsProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  size?: string;
  selected?: boolean;
}

export type ToggleChipsType = React.ForwardRefExoticComponent<
  ToggleChipsProps & React.RefAttributes<HTMLButtonElement>
>;

const ToggleChips: ToggleChipsType = forwardRef(
  ({ children, size = 'xsmall', className, onClick, ...rest }, ref) => {
    const [selected, setSelectedState] = useState(false);

    const onClickFunctions = () => {
      selected ? setSelectedState(false) : setSelectedState(true);
      () => onClick;
    };
    return (
      <button
        ref={ref}
        {...rest}
        onClick={() => onClickFunctions()}
        className={cn(
          className,
          classes.toggleChips,
          classes.chipBase,
          classes[size],
          classes.buttonTextContainer,
          selected && classes.active,
        )}
      >
        <div className={classes.buttonTextContainer}>
          {selected && (
            <span className={cn(classes.checkmarkContainer)}>
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
    );
  },
);

export default ToggleChips;
