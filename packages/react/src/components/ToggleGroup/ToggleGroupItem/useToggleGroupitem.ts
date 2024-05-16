import { useContext, useId } from 'react';

import type { ToggleGroupContextProps } from '../ToggleGroup';
import { ToggleGroupContext } from '../ToggleGroup';
import type { ButtonProps } from '../../Button';

import type { ToggleGroupItemProps } from './ToggleGroupItem';

type UseToggleGroupItem = (props: ToggleGroupItemProps) => {
  active: boolean;
  size?: ToggleGroupContextProps['size'];
  buttonProps?: Pick<
    ButtonProps,
    'id' | 'onClick' | 'role' | 'aria-checked' | 'aria-current' | 'name'
  >;
};

/** Handles props for `ToggleGroup.Item` in context with `ToggleGroup` and `RovingTabIndex` */
export const useToggleGroupItem: UseToggleGroupItem = (
  props: ToggleGroupItemProps,
) => {
  const { ...rest } = props;
  const toggleGroup = useContext(ToggleGroupContext);
  const itemValue =
    props.value ?? (typeof props.children === 'string' ? props.children : '');
  const active = toggleGroup.value == itemValue;
  const buttonId = `togglegroup-item-${useId()}`;

  return {
    ...rest,
    active: active,
    size: toggleGroup?.size,
    buttonProps: {
      id: buttonId,
      'aria-checked': active,
      'aria-current': active,
      role: 'radio',
      name: toggleGroup.name,
      onClick: () => {
        toggleGroup.onChange?.(itemValue);
      },
    },
  };
};
