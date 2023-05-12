import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import classes from './Chips.module.css';

export interface RemovableChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  /**
   * Click callback
   */
  onDelete?: () => void;
  /**
   * Replaces label read for screen-readers
   * @default "slett filter"
   */
  removeLabel?: string;
}

export type RemovableChipType = React.ForwardRefExoticComponent<
  RemovableChipProps & React.RefAttributes<HTMLButtonElement>
>;

const RemovableChip: RemovableChipType = forwardRef(
  (
    { className, children, removeLabel = 'slett filter', onDelete, ...rest },
    ref,
  ) => {
    return (
      <li>
        <button
          ref={ref}
          {...rest}
          aria-label={`${children} ${removeLabel}`}
          className={cn(className, classes.chip, classes.removable)}
          onClick={(e) => {
            onDelete?.();
            rest?.onClick?.(e);
          }}
        >
          <div className={classes.content}>
            <div className={classes.text}>{children}</div>
            <span className={classes.xmark}>
              <XMarkIcon aria-hidden />
            </span>
          </div>
        </button>
      </li>
    );
  },
);

RemovableChip.displayName = 'RemovableChip';

export default RemovableChip;
