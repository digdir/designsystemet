import type { HTMLAttributes } from 'react';
import { forwardRef, useContext } from 'react';
import cl from 'clsx/lite';

import { RovingFocusRoot } from '../../utilities/RovingFocus';

import { TabsContext } from './TabsRoot';

export const TabList = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className, ...rest }, ref) => {
  const { value } = useContext(TabsContext);

  return (
    <RovingFocusRoot
      role='tablist'
      activeValue={value}
      className={cl('ds-tabs__tablist', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </RovingFocusRoot>
  );
});

TabList.displayName = 'TabList';
