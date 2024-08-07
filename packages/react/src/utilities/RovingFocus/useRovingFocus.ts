// Logic from: https://www.joshuawootonn.com/react-roving-tabindex
// Inspired by: https://github.com/radix-ui/primitives/tree/main/packages/react/roving-focus/src

import type { HTMLAttributes } from 'react';
import { useContext } from 'react';

import { RovingFocusContext } from './RovingFocusRoot';

/** Handles props for `RovingFocus` in context with `RovingFocusRoot` */
export const useRovingFocus = (value: string) => {
  const {
    elements,
    getOrderedItems,
    setFocusableValue,
    focusableValue,
    onShiftTab,
    horizontalArrows,
    verticalArrows,
  } = useContext(RovingFocusContext);

  return {
    getOrderedItems,
    isFocusable: focusableValue === value,
    horizontalArrows,
    verticalArrows,
    getRovingProps: <T extends HTMLElement>(props: HTMLAttributes<T>) => ({
      ...props,
      ref: (element: HTMLElement | null) => {
        if (element) {
          elements.current.set(value, element);
        } else {
          elements.current.delete(value);
        }
      },
      onKeyDown: (e: React.KeyboardEvent<T>) => {
        props?.onKeyDown?.(e);
        if (e.shiftKey && e.key === 'Tab') {
          onShiftTab();
          return;
        }
      },
      onFocus: (e: React.FocusEvent<T>) => {
        props?.onFocus?.(e);
        setFocusableValue(value);
      },
      'data-roving-tabindex-item': true,
      tabIndex: focusableValue === value ? 0 : -1,
    }),
  };
};
