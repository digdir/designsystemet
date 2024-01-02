import React, { forwardRef, useContext } from 'react';
import cl from 'clsx';

import { ComboboxContext } from '../Combobox';

import classes from './Empty.module.css';

type ComboboxEmptyProps = React.HTMLAttributes<HTMLDivElement>;

export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ children, className, ...rest }, ref) => {
    const context = useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxError must be used within a Combobox');
    }

    const { optionValues, size } = context;

    return (
      optionValues.length === 0 && (
        <div
          {...rest}
          ref={ref}
          className={cl(classes.empty, classes[size], className)}
        >
          {children}
        </div>
      )
    );
  },
);

export default ComboboxEmpty;
