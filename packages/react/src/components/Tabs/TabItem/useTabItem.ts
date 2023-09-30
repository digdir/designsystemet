import { useContext, useId } from 'react';

import { TabsContext } from '../Tabs';
import type { ButtonProps } from '../../Button';

import type { TabItemProps } from './TabItem';

type UseTabItem = (props: TabItemProps) => {
  active: boolean;
  size?: 'small' | 'medium' | 'large';
  buttonProps?: Pick<
    ButtonProps,
    'id' | 'onClick' | 'aria-checked' | 'aria-current'
  >;
};

/** Handles props for `ToggleGroup.Item` in context with `ToggleGroup` and `RovingTabIndex` */
export const useTabItem: UseTabItem = (props: TabItemProps) => {
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
      'aria-checked': active,
      'aria-current': active,
      role: 'radio',
      onClick: () => {
        tabs.onChange?.(itemValue);
      },
    },
  };
};
