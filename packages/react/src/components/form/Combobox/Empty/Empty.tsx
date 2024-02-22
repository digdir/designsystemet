import { forwardRef, useContext } from 'react';
import type * as React from 'react';
import cl from 'clsx';

import { ComboboxContext } from '../Combobox';

import classes from './Empty.module.css';

type ComboboxEmptyProps = React.HTMLAttributes<HTMLDivElement>;

export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ children, className, ...rest }, ref) => {
    const context = useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxEmpty must be used within a Combobox');
    }

    const { optionValues, size } = context;

    return (
      optionValues.length === 0 && (
        <div
          ref={ref}
          className={cl(classes.empty, classes[size], className)}
          {...rest}
        >
          {children}
        </div>
      )
    );
  },
);

ComboboxEmpty.displayName = 'ComboboxEmpty';

export default ComboboxEmpty;
