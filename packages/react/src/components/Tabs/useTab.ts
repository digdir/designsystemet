import type { HTMLAttributes } from 'react';
import { useContext, useId } from 'react';

import type { TabsContextProps } from './Tabs';
import { TabsContext } from './Tabs';

import type { TabProps } from '.';

type UseTab = (
  props: TabProps,
) => Pick<
  HTMLAttributes<HTMLButtonElement>,
  'id' | 'aria-selected' | 'role' | 'onClick'
> & { size?: TabsContextProps['size'] };

/** Handles props for `Tab` in context with `Tabs` */
export const useTabItem: UseTab = (props: TabProps) => {
  const { value, ...rest } = props;
  const tabs = useContext(TabsContext);
  const buttonId = `tab-${useId()}`;

  return {
    ...rest,
    id: buttonId,
    'aria-selected': tabs.value == value,
    role: 'tab',
    size: tabs.size,
    onClick: () => {
      tabs.onChange?.(value);
    },
  };
};
