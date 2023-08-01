import React, { forwardRef } from 'react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';

import { ChipBase, type ChipBaseProps } from '../_ChipBase';

import classes from './Toggle.module.css';

export type ToggleChipProps = {
  /**
   * Condition if the check mark icon should be displayed
   */
  checkmark?: boolean;
} & ChipBaseProps;

export const ToggleChip = forwardRef<HTMLButtonElement, ToggleChipProps>(
  (
    {
      children,
      size = 'small',
      selected = false,
      checkmark = false,
      ...rest
    }: ToggleChipProps,
    ref,
  ) => {
    const shouldDisplayCheckmark = checkmark && selected;

    return (
      <ChipBase
        {...rest}
        size={size}
        as='button'
        type='button'
        ref={ref}
        selected={selected}
        className={cn(
          { [classes.spacing]: shouldDisplayCheckmark },
          rest.className,
        )}
      >
        {shouldDisplayCheckmark && (
          <CheckmarkIcon
            className={classes.checkmarkIcon}
            aria-hidden
          />
        )}
        <span>{children}</span>
      </ChipBase>
    );
  },
);
