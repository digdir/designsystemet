import React, { forwardRef, useContext } from 'react';
import cn from 'classnames';

import { ComboboxContext } from '../Combobox';

import classes from './Empty.module.css';

type ComboboxEmptyProps = React.HTMLAttributes<HTMLDivElement>;

export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ children, ...rest }, ref) => {
    const context = useContext(ComboboxContext);
    if (!context) {
      throw new Error('ComboboxItem must be used within a Combobox');
    }

    const { showEmptyChild, size } = context;

    return (
      showEmptyChild && (
        <div
          {...rest}
          ref={ref}
          className={cn(classes.empty, classes[size], rest.className)}
        >
          {children}
        </div>
      )
    );
  },
);

export default ComboboxEmpty;
