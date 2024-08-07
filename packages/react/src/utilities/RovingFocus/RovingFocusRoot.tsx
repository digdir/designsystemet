// Logic from: https://www.joshuawootonn.com/react-roving-tabindex
// Inspired by: https://github.com/radix-ui/primitives/tree/main/packages/react/roving-focus/src

import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { createContext, forwardRef, useEffect, useRef, useState } from 'react';
import type {
  FocusEvent,
  HTMLAttributes,
  MutableRefObject,
  ReactNode,
} from 'react';

type RovingFocusRootBaseProps = {
  /** The children of the `RovingFocusRoot`. The children should get their roving-relevant props from the `useRovingFocus` hook. */
  children: ReactNode;
  /** The value of the element that should be focused when the `RovingFocusRoot` receives focus. */
  activeValue?: string;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /**
   * Changes what arrow keys are used to navigate the roving focus.
   * Sets correct `aria-orientation` attribute, if `vertical` or `horizontal`.
   *
   * @default 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal' | 'ambiguous';
} & HTMLAttributes<HTMLElement>;

export type RovingFocusElement = {
  value: string;
  element: HTMLElement;
};

export type RovingFocusProps = {
  elements: MutableRefObject<Map<string, HTMLElement>>;
  getOrderedItems: () => RovingFocusElement[];
  setFocusableValue: (value: string) => void;
  focusableValue: string | null;
  onShiftTab: () => void;
  orientation: 'vertical' | 'horizontal' | 'ambiguous';
};

export const RovingFocusContext = createContext<RovingFocusProps>({
  elements: { current: new Map<string, HTMLElement>() },
  getOrderedItems: () => [],
  setFocusableValue: () => {
    /* intentionally empty */
  },
  onShiftTab: () => {
    /* intentionally empty */
  },
  focusableValue: null,
  orientation: 'horizontal',
});

export const RovingFocusRoot = forwardRef<
  HTMLElement,
  RovingFocusRootBaseProps
>(
  (
    {
      activeValue,
      asChild,
      orientation = 'horizontal',
      onBlur,
      onFocus,
      ...rest
    },
    ref,
  ) => {
    const Component = asChild ? Slot : 'div';

    const [focusableValue, setFocusableValue] = useState<string | null>(null);
    const [isShiftTabbing, setIsShiftTabbing] = useState(false);
    const elements = useRef(new Map<string, HTMLElement>());
    const myRef = useRef<HTMLElement>();

    const refs = useMergeRefs([ref, myRef]);

    const getOrderedItems = (): RovingFocusElement[] => {
      if (!myRef.current) return [];
      const elementsFromDOM = Array.from(
        myRef.current.querySelectorAll<HTMLElement>(
          '[data-roving-tabindex-item]',
        ),
      );

      return Array.from(elements.current)
        .sort(
          (a, b) =>
            elementsFromDOM.indexOf(a[1]) - elementsFromDOM.indexOf(b[1]),
        )
        .map(([value, element]) => ({ value, element }));
    };

    useEffect(() => {
      setFocusableValue(activeValue ?? null);
    }, [activeValue]);

    return (
      <RovingFocusContext.Provider
        value={{
          elements,
          getOrderedItems,
          focusableValue,
          setFocusableValue,
          onShiftTab: () => {
            setIsShiftTabbing(true);
          },
          orientation,
        }}
      >
        <Component
          {...rest}
          tabIndex={isShiftTabbing ? -1 : 0}
          onBlur={(e: FocusEvent<HTMLElement>) => {
            onBlur?.(e);
            setIsShiftTabbing(false);
            setFocusableValue(activeValue ?? null);
          }}
          onFocus={(e: FocusEvent<HTMLElement>) => {
            onFocus?.(e);
            if (e.target !== e.currentTarget) return;
            const orderedItems = getOrderedItems();
            if (orderedItems.length === 0) return;

            if (focusableValue != null) {
              elements.current.get(focusableValue)?.focus();
            } else if (activeValue != null) {
              elements.current.get(activeValue)?.focus();
            } else {
              orderedItems.at(0)?.element.focus();
            }
          }}
          aria-orientation={
            orientation === 'ambiguous' ? undefined : orientation
          }
          ref={refs}
        />
      </RovingFocusContext.Provider>
    );
  },
);
