import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';

import { Paragraph } from '../../Typography';
import { ChipGroupContext } from '../Group';
import utilityClasses from '../../../utilities/utility.module.css';
import classes from '../Chip.module.css';

export type ToggleChipProps = {
  /**
   * Enables check mark icon
   */
  checkmark?: boolean;
  /**
   * Changes padding and font-sizes.
   */
  size?: 'xsmall' | 'small';
  /**
   * Toggles `aria-pressed` and visual-changes
   * */
  selected?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ToggleChip = forwardRef<HTMLButtonElement, ToggleChipProps>(
  (
    {
      children,
      size = 'medium',
      selected = false,
      checkmark = true,
      ...rest
    }: ToggleChipProps,
    ref,
  ) => {
    const shouldDisplayCheckmark = checkmark && selected;
    const group = useContext(ChipGroupContext);

    return (
      <button
        {...rest}
        ref={ref}
        type='button'
        aria-pressed={selected}
        className={cn(
          classes.chipButton,
          utilityClasses.focusable,
          classes[group?.size || size],
          { [classes.spacing]: shouldDisplayCheckmark },
          rest.className,
        )}
      >
        <Paragraph
          as='span'
          size={size}
          className={classes.label}
        >
          {shouldDisplayCheckmark && (
            <CheckmarkIcon
              className={classes.checkmarkIcon}
              aria-hidden
            />
          )}
          <span>{children}</span>
        </Paragraph>
      </button>
    );
  },
);
