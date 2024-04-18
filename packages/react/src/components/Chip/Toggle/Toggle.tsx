import type { ButtonHTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx';

import { Paragraph } from '../../Typography';
import { ChipGroupContext } from '../Group/Group';
import classes from '../Chip.module.css';

export type ToggleChipProps = {
  /**
   * Enables check mark icon
   */
  checkmark?: boolean;
  /**
   * Changes padding and font-sizes.
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
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
      className,
      ...rest
    }: ToggleChipProps,
    ref,
  ) => {
    const shouldDisplayCheckmark = checkmark && selected;
    const group = useContext(ChipGroupContext);

    return (
      <button
        ref={ref}
        type='button'
        aria-pressed={selected}
        className={cl(
          classes.chipButton,
          `fds-focus`,
          classes[group?.size || size],
          { [classes.spacing]: shouldDisplayCheckmark },
          className,
        )}
        {...rest}
      >
        <Paragraph
          asChild
          size={group?.size || size}
          short
        >
          <span className={classes.label}>
            {shouldDisplayCheckmark && (
              <CheckmarkIcon
                className={classes.checkmarkIcon}
                aria-hidden
              />
            )}
            <span>{children}</span>
          </span>
        </Paragraph>
      </button>
    );
  },
);

ToggleChip.displayName = 'ChipToggle';
