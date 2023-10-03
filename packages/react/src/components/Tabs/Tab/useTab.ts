import { HTMLAttributes, useContext, useId } from 'react';

import { TabsContext } from '../Tabs';

import type { TabProps } from './Tab';

type UseTab = (props: TabProps) => {
  active: boolean;
  size?: 'small' | 'medium' | 'large';
} & Pick<
  HTMLAttributes<HTMLButtonElement>,
  'id' | 'aria-selected' | 'role' | 'onClick'
>;

/** Handles props for `Tab` in context with `Tabs` */
export const useTabItem: UseTab = (props: TabProps) => {
  const { ...rest } = props;
  const tabs = useContext(TabsContext);
  const itemValue =
    props.value ?? (typeof props.children === 'string' ? props.children : '');
  const active = tabs.value == itemValue;
  const buttonId = `tab-${useId()}`;

  return {
    ...rest,
    active: active,
    size: tabs?.size,
    id: buttonId,
    'aria-selected': active,
    role: 'tab',
    onClick: () => {
      tabs.onChange?.(itemValue);
    },
  };
};
