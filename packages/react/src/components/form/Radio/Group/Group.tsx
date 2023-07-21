import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './Group.module.css';

export type RadioGroupProps = {
  /** Description of what myProp does in the component */
  myProp?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
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
