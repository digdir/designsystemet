import type { HTMLAttributes } from 'react';
import { Children, isValidElement, forwardRef, createContext } from 'react';
import cl from 'clsx/lite';

import { getSize } from '../../../utilities/getSize';

type OldChipSizes = 'small' | 'medium' | 'large';

export type ChipGroupContext = {
  size?: 'sm' | 'md' | 'lg' | OldChipSizes;
};

export const ChipGroupContext = createContext<ChipGroupContext | null>(null);

export type ChipGroupProps = {
  /**
   * Changes Chip size and gap between chips.
   * @default 'md'
   * @note `small`, `medium`, `large` is deprecated
   */
  size?: ChipGroupContext['size'];
} & HTMLAttributes<HTMLUListElement>;

export const Group = forwardRef<HTMLUListElement, ChipGroupProps>(
  ({ children, className, ...rest }: ChipGroupProps, ref) => {
    const size = getSize(rest.size || 'md') as ChipGroupContext['size'];

    return (
      <ul
        ref={ref}
        className={cl(
          `fds-chip--group-container`,
          `fds-chip--${size}`,
          className,
        )}
        {...rest}
      >
        <ChipGroupContext.Provider value={{ size }}>
          {Children.toArray(children).map((child, index) =>
            isValidElement(child) ? (
              <li key={`chip-${index}`}>{child}</li>
            ) : null,
          )}
        </ChipGroupContext.Provider>
      </ul>
    );
  },
);

Group.displayName = 'ChipGroup';
