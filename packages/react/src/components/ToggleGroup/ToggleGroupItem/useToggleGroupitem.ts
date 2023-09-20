import { useContext, useId } from 'react';
import { useMergeRefs } from '@floating-ui/react';

import type { RovingTabindexItem } from '../ToggleGroup';
import { ToggleGroupContext } from '../ToggleGroup';
import type { ButtonProps } from '../../Button';
import { useRovingTabindex } from '../../../utility-components/RovingTabIndex/useRovingTabindex';
import {
  getNextFocusableValue,
  getPrevFocusableValue,
} from '../../../utility-components/RovingTabIndex';

import type { ToggleGroupItemProps } from './ToggleGroupItem';

export type RovingTabindexContextProps = {
  elements: React.MutableRefObject<Map<string, HTMLElement>>;
  getOrderedItems: () => RovingTabindexItem[];
  setFocusableValue: (value: string) => void;
  focusableValue: string | null;
  onShiftTab: () => void;
};

type UseToggleGroupItem = (
  props: ToggleGroupItemProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
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
  ref: React.ForwardedRef<HTMLButtonElement>,
) => {
  const { ...rest } = props;
  const toggleGroup = useContext(ToggleGroupContext);
  const { getOrderedItems, getRovingProps } = useRovingTabindex(props.value);
  const active = toggleGroup.value == props.value;
  const buttonId = `toggleButton-${useId()}`;
  const rovingProps = getRovingProps<'button'>({
    onKeyDown: (e) => {
      props?.onKeyDown?.(e);
      const items = getOrderedItems();
      let nextItem: RovingTabindexItem | undefined;
      if (e.key === 'ArrowRight') {
        nextItem = getNextFocusableValue(items, props.value);
      } else if (e.key === 'ArrowLeft') {
        nextItem = getPrevFocusableValue(items, props.value);
      }
      nextItem?.element.focus();
    },
  });

  const itemRef = useMergeRefs([ref, rovingProps.ref]);

  return {
    ...rest,
    active: active,
    buttonProps: {
      id: buttonId,
      'aria-checked': active,
      'aria-current': active,
      variant: active ? 'filled' : 'outline',
      size: toggleGroup?.size,
      iconPlacement: 'left',
      role: 'radio',
      name: toggleGroup.name,
      onClick: () => {
        toggleGroup.onChange?.(props.value);
      },
      ...rovingProps,
      ref: itemRef,
    },
  };
};
