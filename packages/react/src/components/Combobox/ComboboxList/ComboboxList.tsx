import type { MutableRefObject, ReactNode } from 'react';
import React from 'react';
import type { UseFloatingReturn, useInteractions } from '@floating-ui/react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';

import style from './ComboboxList.module.css';
import { ComboboxItem } from './ComboboxItem';

export interface ComboboxListProps {
  activeIndex: number | null;
  floating: UseFloatingReturn<HTMLInputElement>;
  interactions: ReturnType<typeof useInteractions>;
  listRef: MutableRefObject<(HTMLElement | null)[]>;
  onSelect: (value: string) => void;
  open: boolean;
  optionLabel: (value: string) => ReactNode;
  options: string[];
}

export const ComboboxList = ({
  activeIndex,
  floating,
  interactions,
  listRef,
  onSelect,
  open,
  optionLabel,
  options,
}: ComboboxListProps) => {
  const { refs, floatingStyles, context } = floating;
  const { getFloatingProps, getItemProps } = interactions;
  return (
    <FloatingPortal>
      {open && (
        <FloatingFocusManager
          context={context}
          initialFocus={-1}
          visuallyHiddenDismiss
        >
          <ul
            {...getFloatingProps({
              ref: refs.setFloating,
              style: floatingStyles,
            })}
            className={style.list}
          >
            {options.map((item, index) => (
              <ComboboxItem
                key={item}
                {...getItemProps({
                  ref: (node) => {
                    listRef.current[index] = node;
                  },
                  onClick: () => {
                    onSelect(item);
                    refs.domReference.current?.focus();
                  },
                })}
                active={activeIndex === index}
              >
                {optionLabel(item)}
              </ComboboxItem>
            ))}
          </ul>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
};
