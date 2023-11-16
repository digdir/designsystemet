import type { ButtonHTMLAttributes } from 'react';
import React, { useContext, forwardRef } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import classes from '../Chip.module.css';
import { Paragraph } from '../../Typography';
import { ChipGroupContext } from '../Group';
import utilityClasses from '../../../utilities/utility.module.css';

export type RemovableChipProps = {
  /**
   * Changes padding and font-sizes.
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const RemovableChip = forwardRef<HTMLButtonElement, RemovableChipProps>(
  ({ children, size = 'medium', ...rest }, ref) => {
    const group = useContext(ChipGroupContext);

    return (
      <button
        {...rest}
        type='button'
        ref={ref}
        className={cn(
          classes.chipButton,
          utilityClasses.focusable,
          classes[group?.size || size],
          classes.removable,
          rest.className,
        )}
      >
        <Paragraph
          as='span'
          size={group?.size || size}
          className={classes.label}
        >
          {children}
          <span
            className={classes.xMark}
            aria-hidden
          >
            <XMarkIcon className={classes.icon} />
          </span>
        </Paragraph>
      </button>
    );
  },
);
