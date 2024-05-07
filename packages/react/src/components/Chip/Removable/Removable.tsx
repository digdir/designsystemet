import type { ButtonHTMLAttributes } from 'react';
import { useContext, forwardRef } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';

import { Paragraph } from '../../Typography';
import { ChipGroupContext } from '../Group/Group';

export type RemovableChipProps = {
  /**
   * Changes padding and font-sizes.
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const RemovableChip = forwardRef<HTMLButtonElement, RemovableChipProps>(
  ({ children, size = 'medium', className, ...rest }, ref) => {
    const group = useContext(ChipGroupContext);

    return (
      <button
        type='button'
        ref={ref}
        className={cl(
          `fds-focus`,
          `fds-chip--button`,
          `fds-chip--removable`,
          `fds-chip--${group?.size || size}`,
          className,
        )}
        {...rest}
      >
        <Paragraph
          asChild
          size={group?.size || size}
          variant='short'
        >
          <span className={`fds-chip__label`}>
            <span>{children}</span>
            <span
              className={`fds-chip__x-mark`}
              aria-hidden
            >
              <XMarkIcon className={`fds-chip__icon`} />
            </span>
          </span>
        </Paragraph>
      </button>
    );
  },
);

RemovableChip.displayName = 'ChipRemovable';
