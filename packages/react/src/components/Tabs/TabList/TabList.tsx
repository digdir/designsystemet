import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';

import { RovingTabindexRoot } from '../../../utilities/RovingTabIndex';

import classes from './TabList.module.css';

export const TabList = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...rest }, ref) => {
  return (
    <RovingTabindexRoot
      role='tablist'
      className={cl(classes.tabItemList, className)}
      ref={ref}
      {...rest}
    >
      {children}
    </RovingTabindexRoot>
  );
});

TabList.displayName = 'TabList';
