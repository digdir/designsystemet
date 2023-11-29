import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './Description.module.css';

type ComboboxItemDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export const ComboboxItemDescription = forwardRef<
  HTMLDivElement,
  ComboboxItemDescriptionProps
>(({ children, ...rest }, ref) => {
  return (
    <div
      {...rest}
      className={cn(classes.description, rest.className)}
      ref={ref}
    >
      {children}
    </div>
  );
});

export default ComboboxItemDescription;
