import type { ButtonHTMLAttributes } from 'react';
import { useContext, forwardRef } from 'react';
import cl from 'clsx';
import { XMarkIcon } from '@navikt/aksel-icons';

import classes from '../Chip.module.css';
import { Paragraph } from '../../Typography';
import { ChipGroupContext } from '../Group/Group';
import utilityClasses from '../../../utilities/utility.module.css';

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
          classes.chipButton,
          utilityClasses.focusable,
          classes[group?.size || size],
          classes.removable,
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
            <span>{children}</span>
            <span
              className={classes.xMark}
              aria-hidden
            >
              <XMarkIcon className={classes.icon} />
            </span>
          </span>
        </Paragraph>
      </button>
    );
  },
);

RemovableChip.displayName = 'ChipRemovable';
