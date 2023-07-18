import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './Fieldset.module.css';

export type FieldsetProps = {
  /** Description of what myProp does in the component */
  myProp?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Fieldset = forwardRef<HTMLDivElement, FieldsetProps>(
  ({ myProp = false, children, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={cn(myProp && classes.myClass, rest.className)}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);
