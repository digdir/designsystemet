import { useContext, useId } from 'react';

import type { ButtonProps } from '../Button';
import { ToggleGroupContext } from './ToggleGroup';

import type { ToggleGroupItemProps } from './ToggleGroupItem';

type UseToggleGroupItem = (props: ToggleGroupItemProps) => {
  active: boolean;
  value: string;
  buttonProps?: Pick<
    ButtonProps,
    'id' | 'onClick' | 'role' | 'aria-checked' | 'aria-current' | 'name'
  >;
};

/** Handles props for `ToggleGroup.Item` in context with `ToggleGroup` and `RovingFocus` */
export const useToggleGroupItem: UseToggleGroupItem = (
  props: ToggleGroupItemProps,
) => {
  const { ...rest } = props;
  const genValue = useId();
  const toggleGroup = useContext(ToggleGroupContext);
  const value = props.value ?? genValue;
  const active = toggleGroup.value === value;
  const buttonId = `togglegroup-item-${useId()}`;

  return {
    ...rest,
    active: active,
    value,
    buttonProps: {
      id: buttonId,
      'aria-checked': active,
      'aria-current': active,
      role: 'radio',
      name: toggleGroup.name,
      onClick: () => {
        toggleGroup.onChange?.(value);
      },
    },
  };
};
