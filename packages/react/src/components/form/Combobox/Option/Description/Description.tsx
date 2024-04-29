import { forwardRef } from 'react';
import type * as React from 'react';
import cl from 'clsx';

import classes from './Description.module.css';

type ComboboxOptionDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export const ComboboxOptionDescription = forwardRef<HTMLSpanElement, ComboboxOptionDescriptionProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <span
        className={cl(classes.description, className)}
        ref={ref}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

ComboboxOptionDescription.displayName = 'ComboboxOptionDescription';

export default ComboboxOptionDescription;
