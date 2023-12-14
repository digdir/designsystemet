import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './Description.module.css';

type ComboboxOptionDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export const ComboboxOptionDescription = forwardRef<
  HTMLSpanElement,
  ComboboxOptionDescriptionProps
>(({ children, ...rest }, ref) => {
  return (
    <span
      {...rest}
      className={cn(classes.description, rest.className)}
      ref={ref}
    >
      {children}
    </span>
  );
});

export default ComboboxOptionDescription;
