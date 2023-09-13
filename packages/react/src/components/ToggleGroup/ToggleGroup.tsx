import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './ToggleGroup.module.css';

export type ToggleGroupProps = {
  /** Description of what myProp does in the component */
} & HTMLAttributes<HTMLDivElement>;

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ children, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={cn(classes.toggleGroupContainer, rest.className)}
        ref={ref}
      >
        <div
          className={classes.groupContent}
          role='radiogroup'
        >
          {children}
        </div>
      </div>
    );
  },
);
