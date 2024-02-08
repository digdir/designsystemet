import { forwardRef, useContext, useId } from 'react';
import type * as React from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import { ComboboxContext } from '../Combobox';

import classes from './Custom.module.css';

export type ComboboxCustomProps = {
  /**
   * Adds the item to the navigation flow at the start of the list.
   * @default false
   */
  interactive?: boolean;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const ComboboxCustom = forwardRef<HTMLDivElement, ComboboxCustomProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';

    const randomId = useId();

    const context = useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxCustom must be used within a Combobox');
    }

    const { size } = context;

    return (
      <Component
        ref={ref}
        tabIndex={-1}
        className={cl(classes.custom, classes[size], className)}
        id={rest.id || randomId}
        role='option'
        {...rest}
      />
    );
  },
);

export default ComboboxCustom;
