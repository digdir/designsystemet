import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import classes from './Chips.module.css';

export interface RemovableChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;

  // variant?: 'action' | 'neutral'; Spørr Marianne om dette skal være med

  onDelete?: () => void;
}

export type RemovableChipType = React.ForwardRefExoticComponent<
  RemovableChipProps & React.RefAttributes<HTMLButtonElement>
>;

const RemovableChip: RemovableChipType = forwardRef(
  ({ children, className, onDelete, ...rest }, ref) => {
    return (
      <li>
        <button
          ref={ref}
          {...rest}
          className={cn(className, classes.chip, classes.removable)}
          onClick={(e) => {
            onDelete?.();
            rest?.onClick?.(e);
          }}
        >
          <div className={classes.content}>
            <div className={classes.text}>{children}</div>
            <span
              className={classes.xmark}
              id='xmarkContainer'
            >
              <XMarkIcon
                title='a11y-title'
                fontSize={'20px'}
              />
            </span>
          </div>
        </button>
      </li>
    );
  },
);

RemovableChip.displayName = 'RemovableChip';

export default RemovableChip;
