import type { ButtonHTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';

import { Paragraph } from '../../Typography';
import { ChipGroupContext } from '../Group/Group';

export type ToggleChipProps = {
  /**
   * Enables check mark icon
   */
  checkmark?: boolean;
  /**
   * Changes Chip size and gap between chips.
   * @default 'md'
   */
  size?: ChipGroupContext['size'];
  /**
   * Toggles `aria-pressed` and visual-changes
   * */
  selected?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ToggleChip = forwardRef<HTMLButtonElement, ToggleChipProps>(
  (
    {
      children,
      selected = false,
      checkmark = true,
      size = 'md',
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
          `ds-focus`,
          `ds-chip--button`,
          `ds-chip--${group?.size || size}`,
          shouldDisplayCheckmark && `ds-chip--spacing`,
          className,
        )}
        {...rest}
      >
        <Paragraph asChild size={group?.size || size} variant='short'>
          <span className={`ds-chip__label`}>
            {shouldDisplayCheckmark && (
              <CheckmarkIcon
                className={`ds-chip__checkmark-icon`}
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
