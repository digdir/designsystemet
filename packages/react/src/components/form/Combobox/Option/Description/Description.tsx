import React, { forwardRef } from 'react';
import cl from 'clsx';

import classes from './Description.module.css';

type ComboboxOptionDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export const ComboboxOptionDescription = forwardRef<
  HTMLSpanElement,
  ComboboxOptionDescriptionProps
>(({ children, ...rest }, ref) => {
  return (
    <span
      {...rest}
      className={cl(classes.description, rest.className)}
      ref={ref}
    >
      {children}
    </span>
  );
});

export default ComboboxOptionDescription;
