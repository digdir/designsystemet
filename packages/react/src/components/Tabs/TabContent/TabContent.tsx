import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import classes from './TabContent.module.css';

export type TabContentProps = {
  /** Description of what myProp does in the component */
  value?: string;
} & HTMLAttributes<HTMLDivElement>;

export const TabContent = forwardRef<HTMLDivElement, TabContentProps>(
  ({ children, ...rest }, ref) => {
    return (
      <div
        {...rest}
        className={cn(classes.tabItemList, rest.className)}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);
