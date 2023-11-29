import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './Description.module.css';

type ComboboxItemDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export const ComboboxItemDescription = forwardRef<
  HTMLSpanElement,
  ComboboxItemDescriptionProps
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

export default ComboboxItemDescription;
