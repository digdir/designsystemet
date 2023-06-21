import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';
import { CheckmarkIcon } from '@navikt/aksel-icons';

import type { OverridableComponent } from '../../types/OverridableComponent';

import classes from './Chip.module.css';
import { ChipButton, type ChipButtonProps } from './_ChipButton';

export type ChipProps = ChipButtonProps & {
  /**
   * Condition if the check mark icon should be displayed
   */
  checkmark?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export const Chip: OverridableComponent<ChipProps, HTMLButtonElement> =
  forwardRef(
    (
      {
        children,
        checkmark = false,
        selected = false,
        as: Component = 'button',
        ...rest
      },
      ref,
    ): JSX.Element => {
      const shouldDisplayCheckmark = checkmark && selected;
      return (
        <ChipButton
          {...rest}
          as={Component}
          ref={ref}
          selected={selected}
          className={cn(
            checkmark && selected && classes.spacing,
            rest.className,
          )}
        >
          <div className={cn(shouldDisplayCheckmark && classes.flexContainer)}>
            {shouldDisplayCheckmark && (
              <CheckmarkIcon
                className={classes.checkmarkIcon}
                aria-hidden
              />
            )}
            <span>{children}</span>
          </div>
        </ChipButton>
      );
    },
  );
