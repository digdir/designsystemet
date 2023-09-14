import { useContext } from 'react';

import { ToggleGroupContext } from '../ToggleGroup';
import type { ButtonProps } from '../../Button';

import type { ToggleGroupItemProps } from './ToggleGroupItem';

type UseToggleGroupItem = (props: ToggleGroupItemProps) => {
  active: boolean;
  buttonProps?: Pick<ButtonProps, 'onClick' | 'variant' | 'size'>;
};

/** Handles props for `ToggleGroup.Item` in context with `ToggleGroup` */
export const useToggleGroupItem: UseToggleGroupItem = (props) => {
  const { ...rest } = props;
  const toggleGroup = useContext(ToggleGroupContext);

  return {
    ...rest,
    active: toggleGroup?.value == props.value,
    buttonProps: {
      variant: toggleGroup?.value == props.value ? 'filled' : 'outline',
      size: toggleGroup?.size,
      onClick: () => {
        toggleGroup?.onChange?.(props.value);
      },
    },
  };
};
