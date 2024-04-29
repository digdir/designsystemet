import type { HTMLAttributes } from 'react';
import { useContext, useId } from 'react';

import { TabsContext } from '../Tabs';

import type { TabProps } from './Tab';

type UseTab = (props: TabProps) => {
  active: boolean;
  size?: 'small' | 'medium' | 'large';
} & Pick<HTMLAttributes<HTMLButtonElement>, 'id' | 'aria-selected' | 'role' | 'onClick'>;

/** Handles props for `Tab` in context with `Tabs` */
export const useTabItem: UseTab = (props: TabProps) => {
  const { value, ...rest } = props;
  const tabs = useContext(TabsContext);
  const active = tabs.value == value;
  const buttonId = `tab-${useId()}`;

  return {
    ...rest,
    active: active,
    size: tabs?.size,
    id: buttonId,
    'aria-selected': active,
    role: 'tab',
    onClick: () => {
      tabs.onChange?.(value);
    },
  };
};
