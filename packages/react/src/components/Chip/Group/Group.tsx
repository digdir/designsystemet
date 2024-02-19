import type { HTMLAttributes } from 'react';
import { Children, isValidElement, forwardRef, createContext } from 'react';
import cl from 'clsx';

import classes from '../Chip.module.css';

export type ChipGroupContext = {
  size?: 'small' | 'medium' | 'large';
};

export const ChipGroupContext = createContext<ChipGroupContext | null>(null);

export type ChipGroupProps = {
  /**
   * Changes Chip size and gap between chips.
   */
  size?: 'small' | 'medium' | 'large';
} & HTMLAttributes<HTMLUListElement>;

export const Group = forwardRef<HTMLUListElement, ChipGroupProps>(
  ({ children, size = 'medium', className, ...rest }: ChipGroupProps, ref) => (
    <ul
      ref={ref}
      className={cl(classes.groupContainer, classes[size], className)}
      {...rest}
    >
      <ChipGroupContext.Provider value={{ size }}>
        {Children.toArray(children).map((child, index) =>
          isValidElement(child) ? <li key={`chip-${index}`}>{child}</li> : null,
        )}
      </ChipGroupContext.Provider>
    </ul>
  ),
);

Group.displayName = 'ChipGroup';
