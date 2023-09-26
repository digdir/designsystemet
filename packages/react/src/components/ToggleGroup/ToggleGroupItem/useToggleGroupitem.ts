import { useContext, useId } from 'react';

import type { RovingTabindexItem } from '../ToggleGroup';
import { ToggleGroupContext } from '../ToggleGroup';
import type { ButtonProps } from '../../Button';

import type { ToggleGroupItemProps } from './ToggleGroupItem';

export type RovingTabindexContextProps = {
  elements: React.MutableRefObject<Map<string, HTMLElement>>;
  getOrderedItems: () => RovingTabindexItem[];
  setFocusableValue: (value: string) => void;
  focusableValue: string | null;
  onShiftTab: () => void;
};

type UseToggleGroupItem = (props: ToggleGroupItemProps) => {
  active: boolean;
  elements?: React.MutableRefObject<Map<string, HTMLElement>>;
  keyDown?: (e: KeyboardEvent) => void;
  buttonProps?: Pick<
    ButtonProps,
    | 'onClick'
    | 'variant'
    | 'size'
    | 'tabIndex'
    | 'iconPlacement'
    | 'role'
    | 'aria-checked'
    | 'aria-current'
    | 'name'
    | 'onKeyDown'
    | 'onFocus'
  >;
};

/** Handles props for `ToggleGroup.Item` in context with `ToggleGroup` and `RovingTabIndex` */
export const useToggleGroupItem: UseToggleGroupItem = (
  props: ToggleGroupItemProps,
) => {
  const { ...rest } = props;
  const toggleGroup = useContext(ToggleGroupContext);
  const active = toggleGroup.value == props.value;
  const buttonId = `toggleButton-${useId()}`;

  return {
    ...rest,
    active: active,
    buttonProps: {
      id: buttonId,
      'aria-checked': active,
      'aria-current': active,
      size: toggleGroup?.size,
      role: 'radio',
      name: toggleGroup.name,
      onClick: () => {
        toggleGroup.onChange?.(props.value);
      },
    },
  };
};
