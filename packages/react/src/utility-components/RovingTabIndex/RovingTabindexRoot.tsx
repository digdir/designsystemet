import React, { createContext, useRef, useState } from 'react';
import type {
  ComponentPropsWithoutRef,
  ElementType,
  MutableRefObject,
  ReactNode,
} from 'react';

type RovingTabindexRootBaseProps<T> = {
  children: ReactNode | ReactNode[];
  as?: T;
  valueId?: string;
};

type RovingTabindexRootProps<T extends ElementType> =
  RovingTabindexRootBaseProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof RovingTabindexRootBaseProps<T>>;

export type RovingTabindexItem = {
  value: string;
  element: HTMLElement;
};

export type RovingTabindexProps = {
  elements: MutableRefObject<Map<string, HTMLElement>>;
  getOrderedItems: () => RovingTabindexItem[];
  setFocusableValue: (value: string) => void;
  focusableValue: string | null;
  onShiftTab: () => void;
};

export const RovingTabindexContext = createContext<RovingTabindexProps>({
  elements: { current: new Map<string, HTMLElement>() },
  getOrderedItems: () => [],
  setFocusableValue: () => {
    /* intentionally empty */
  },
  onShiftTab: () => {
    /* intentionally empty */
  },
  focusableValue: null,
});

export function getNextFocusableId(
  items: RovingTabindexItem[],
  value: string,
): RovingTabindexItem | undefined {
  const currIndex = items.findIndex((item) => item.value === value);
  return items.at(currIndex === items.length - 1 ? 0 : currIndex + 1);
}

export function getPrevFocusableId(
  items: RovingTabindexItem[],
  value: string,
): RovingTabindexItem | undefined {
  const currIndex = items.findIndex((item) => item.value === value);
  return items.at(currIndex === 0 ? -1 : currIndex - 1);
}

export const RovingTabindexRoot = <T extends ElementType>({
  children,
  valueId,
  as,
  ...props
}: RovingTabindexRootProps<T>) => {
  const Component = as ?? 'div';
  const [focusableValue, setFocusableValue] = useState<string | null>(null);
  const [isShiftTabbing, setIsShiftTabbing] = useState(false);
  const elements = useRef(new Map<string, HTMLElement>());
  const ref = useRef<HTMLDivElement | null>(null);

  const getOrderedItems = (): RovingTabindexItem[] => {
    if (!ref?.current) return [];
    const elementsFromDOM = Array.from(
      ref?.current.querySelectorAll<HTMLElement>('[data-roving-tabindex-item]'),
    );

    return Array.from(elements.current)
      .sort(
        (a, b) => elementsFromDOM.indexOf(a[1]) - elementsFromDOM.indexOf(b[1]),
      )
      .map(([value, element]) => ({ value, element }));
  };

  return (
    <RovingTabindexContext.Provider
      value={{
        elements,
        getOrderedItems,
        focusableValue,
        setFocusableValue,
        onShiftTab: () => {
          setIsShiftTabbing(true);
        },
      }}
    >
      <Component
        {...props}
        tabIndex={isShiftTabbing ? -1 : 0}
        onBlur={(e) => {
          props?.onBlur?.(e);
          setIsShiftTabbing(false);
        }}
        onFocus={(e) => {
          props?.onFocus?.(e);
          if (e.target !== e.currentTarget) return;
          const orderedItems = getOrderedItems();
          if (orderedItems.length === 0) return;

          if (focusableValue != null) {
            elements.current.get(focusableValue)?.focus();
          } else if (valueId != null) {
            elements.current.get(valueId)?.focus();
          } else {
            orderedItems.at(0)?.element.focus();
          }
        }}
        ref={ref}
      >
        {children}
      </Component>
    </RovingTabindexContext.Provider>
  );
};
