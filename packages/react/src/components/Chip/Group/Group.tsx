import type { HTMLAttributes } from 'react';
import React, { forwardRef, createContext } from 'react';
import cn from 'classnames';

import type { ChipBaseProps } from '../_ChipBase';

import classes from './Group.module.css';

export type ChipGroupContext = {
  size?: ChipBaseProps['size'];
};

export const ChipGroupContext = createContext<ChipGroupContext | null>(null);

export type ChipGroupProps = {
  /**
   * Changes Chip size and gap between chips.
   */
  size?: 'xsmall' | 'small';
} & HTMLAttributes<HTMLUListElement>;

/**
 * Grouping multiple `Chip` together. Avoid mixing different kind of chips.
 * @example
 * <Chip.Group>
 *    <Chip.Removable>Tekst</Chip.Removable>
 *    <Chip.Removable>Tekst</Chip.Removable>
 * </Chip.Group>
 */
export const Group = forwardRef<HTMLUListElement, ChipGroupProps>(
  ({ children, size = 'xsmall', ...rest }: ChipGroupProps, ref) => (
    <ul
      {...rest}
      ref={ref}
      className={cn(classes.groupContainer, classes[size], rest.className)}
    >
      <ChipGroupContext.Provider value={{ size }}>
        {React.Children.toArray(children).map((child, index) =>
          React.isValidElement(child) ? (
            <li key={`${child.toString()}-${index}`}>{child}</li>
          ) : null,
        )}
      </ChipGroupContext.Provider>
    </ul>
  ),
);
