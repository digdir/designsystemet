import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';

import { RovingTabindexRoot } from '../../../utilities/RovingTabIndex';

export const TabList = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...rest }, ref) => {
  return (
    <RovingTabindexRoot
      role='tablist'
      className={cl('ds-tabs__tablist', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </RovingTabindexRoot>
  );
});

TabList.displayName = 'TabList';
