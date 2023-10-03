import { useContext, useId } from 'react';

import { TabsContext } from '../Tabs';
import type { ButtonProps } from '../../Button';

import type { TabProps } from './Tab';

type UseTabItem = (props: TabProps) => {
  active: boolean;
  size?: 'small' | 'medium' | 'large';
  buttonProps?: Pick<
    ButtonProps,
    'id' | 'onClick' | 'aria-checked' | 'aria-current'
  >;
};

/** Handles props for `ToggleGroup.Item` in context with `ToggleGroup` and `RovingTabIndex` */
export const useTabItem: UseTabItem = (props: TabProps) => {
  const { ...rest } = props;
  const tabs = useContext(TabsContext);
  const itemValue =
    props.value ?? (typeof props.children === 'string' ? props.children : '');
  const active = tabs.value == itemValue;
  const buttonId = `togglegroup-item-${useId()}`;

  return {
    ...rest,
    active: active,
    size: tabs?.size,
    buttonProps: {
      id: buttonId,
      'aria-selected': active,
      role: 'tab',
      onClick: () => {
        tabs.onChange?.(itemValue);
      },
    },
  };
};
