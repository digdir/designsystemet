import React, { forwardRef } from 'react';
import cl from 'clsx';

import classes from './Description.module.css';

type ComboboxOptionDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export const ComboboxOptionDescription = forwardRef<
  HTMLSpanElement,
  ComboboxOptionDescriptionProps
>(({ children, className, ...rest }, ref) => {
  return (
    <span
      {...rest}
      className={cl(classes.description, className)}
      ref={ref}
    >
      {children}
    </span>
  );
});

export default ComboboxOptionDescription;
