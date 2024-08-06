import { XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { ButtonHTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';

import { Paragraph } from '../../Typography';
import { ChipGroupContext } from '../Group/Group';

export type RemovableChipProps = {
  /**
   * Changes Chip size and gap between chips.
   * @default 'md'
   */
  size?: ChipGroupContext['size'];
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const RemovableChip = forwardRef<HTMLButtonElement, RemovableChipProps>(
  ({ size = 'md', children, className, ...rest }, ref) => {
    const group = useContext(ChipGroupContext);

    return (
      <button
        type='button'
        ref={ref}
        className={cl(
          `ds-focus`,
          `ds-chip--button`,
          `ds-chip--removable`,
          `ds-chip--${group?.size || size}`,
          className,
        )}
        {...rest}
      >
        <Paragraph asChild size={group?.size || size} variant='short'>
          <span className={`ds-chip__label`}>
            <span>{children}</span>
            <span className={`ds-chip__x-mark`} aria-hidden>
              <XMarkIcon className={`ds-chip__icon`} />
            </span>
          </span>
        </Paragraph>
      </button>
    );
  },
);

RemovableChip.displayName = 'ChipRemovable';
