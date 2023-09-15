/* import { ComponentPropsWithoutRef, ElementType, MutableRefObject, useContext } from "react";


type RovingTabindexContext = {
  focusableId: string | null;
  setFocusableId: (id: string) => void;
  onShiftTab: () => void;
  getOrderedItems: () => RovingTabindexItem[];
  elements: MutableRefObject<Map<string, HTMLElement>>;
};

export function useRovingTabindex(id: string) {
  const { elements, getOrderedItems, setFocusableId, focusableId, onShiftTab } =
    useContext(RovingTabindexContext);

  return {
    getOrderedItems,
    isFocusable: focusableId === id,
    getRovingProps: <T extends ElementType>(
      props: ComponentPropsWithoutRef<T>,
    ) => ({
      ...props,
      ref: (element: HTMLElement | null) => {
        if (element) {
          elements.current.set(id, element);
        } else {
          elements.current.delete(id);
        }
      },
      onKeyDown: (e: KeyboardEvent) => {
        props?.onKeyDown?.(e);
        if (isHotkey('shift+tab', e)) {
          onShiftTab();
          return;
        }
      },
      onFocus: (e: FocusEvent) => {
        props?.onFocus?.(e);
        setFocusableId(id);
      },
      ['data-roving-tabindex-item']: true,
      tabIndex: focusableId === id ? 0 : -1,
    }),
  };
}
 */
