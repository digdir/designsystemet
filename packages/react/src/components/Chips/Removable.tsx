import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import cn from 'classnames';
import classes from './Chips.module.css';
import { XMarkIcon } from '@navikt/aksel-icons';

export interface RemovableChipsProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;

  // variant?: 'action' | 'neutral'; Spørr Marianne om dette skal være med

  onDelete?: () => void;
}

export type RemovableChipsType = React.ForwardRefExoticComponent<
  RemovableChipsProps & React.RefAttributes<HTMLButtonElement>
>;

const RemovableChips: RemovableChipsType = forwardRef(
  ({ children, className, onDelete, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        {...rest}
        className={cn(className, classes.chipBase, classes.removableChips)}
        onClick={(e) => {
          onDelete?.();
          rest?.onClick?.(e);
        }}
      >
        <div className={classes.buttonTextContainer}>
          <div className={classes.buttonText}>{children}</div>
          <span
            className={classes.xmarkContainer}
            id='xmarkContainer'
          >
            <XMarkIcon
              title='a11y-title'
              fontSize={'20px'}
            />
          </span>
        </div>
      </button>
    );
  },
);

export default RemovableChips;
