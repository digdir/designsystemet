import type { MutableRefObject } from 'react';
import React from 'react';
import type { UseFloatingReturn, useInteractions } from '@floating-ui/react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';

import type { ComboboxOption } from '../types/ComboboxOption';

import style from './ComboboxList.module.css';
import { ComboboxItem } from './ComboboxItem';

export interface ComboboxListProps {
  activeIndex: number | null;
  floating: UseFloatingReturn<HTMLInputElement>;
  interactions: ReturnType<typeof useInteractions>;
  listRef: MutableRefObject<(HTMLElement | null)[]>;
  open: boolean;
  options: ComboboxOption[];
  onSelect: (value: string) => void;
}

export const ComboboxList = ({
  activeIndex,
  floating,
  interactions,
  listRef,
  open,
  options,
  onSelect,
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
                key={item.value}
                {...getItemProps({
                  ref: (node) => {
                    listRef.current[index] = node;
                  },
                  onClick: () => {
                    onSelect(item.value);
                    refs.domReference.current?.focus();
                  },
                })}
                active={activeIndex === index}
              >
                {item.label}
              </ComboboxItem>
            ))}
          </ul>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
};
