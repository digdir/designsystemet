import type { HTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';

import { RovingTabindexRoot } from '../../../utilities/RovingTabIndex';

import classes from './TabList.module.css';

export const TabList = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, ...rest }, ref) => {
  return (
    <RovingTabindexRoot
      {...rest}
      role='tablist'
      className={cl(classes.tabItemList, rest.className)}
      ref={ref}
    >
      {children}
    </RovingTabindexRoot>
  );
});
