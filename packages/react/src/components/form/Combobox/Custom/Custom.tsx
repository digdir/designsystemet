import { forwardRef, useContext } from 'react';
import type * as React from 'react';
import cl from 'clsx';
import { Slot } from '@radix-ui/react-slot';

import { ComboboxContext } from '../Combobox';

import classes from './Custom.module.css';

type ComboboxCustomProps = {
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const ComboboxCustom = forwardRef<HTMLDivElement, ComboboxCustomProps>(
  ({ asChild, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'div';

    const context = useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxCustom must be used within a Combobox');
    }

    const { size } = context;

    return (
      <Component
        ref={ref}
        className={cl(classes.custom, classes[size], className)}
        {...rest}
      />
    );
  },
);

export default ComboboxCustom;
