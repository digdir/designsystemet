import React, { useId, useState } from 'react';
import { FloatingPortal } from '@floating-ui/react';
import cn from 'classnames';

import { useEventListener } from '../../../hooks';
import type { MultiSelectOption, SingleSelectOption } from '../types';

import classes from './OptionList.module.css';
import { Option } from './Option';

type OptionListPropsBase<T extends SingleSelectOption | MultiSelectOption> = {
  activeValue?: string;
  expanded: boolean;
  listboxId: string;
  onOptionClick: (value: string) => void;
  optionId: (value: string) => string;
  options: T[];
  referenceHidden?: boolean;
  selectedValues: string[];
  setFloating: (node: HTMLElement | null) => void;
  x: number;
  y: number;
};

export type OptionListProps =
  | (OptionListPropsBase<SingleSelectOption> & { multiple: false })
  | (OptionListPropsBase<MultiSelectOption> & { multiple: true });

const OptionList = ({
  activeValue,
  expanded,
  listboxId,
  multiple,
  onOptionClick,
  optionId,
  options,
  referenceHidden = false,
  selectedValues,
  setFloating,
  x,
  y,
}: OptionListProps) => {
  const portalId = useId();
  const [usingKeyboard, setUsingKeyboard] = useState<boolean>(false);
  useEventListener('click', () => setUsingKeyboard(false));
  useEventListener('keydown', () => setUsingKeyboard(true));

  const isOptionActive = (val: string) => activeValue === val;
  const isOptionSelected = (val: string) =>
    multiple ? selectedValues.includes(val) : isOptionActive(val);

  return (
    <FloatingPortal id={`fds-select-${portalId}`}>
      <span
        className={cn(
          classes.wrapper,
          expanded && classes.expanded,
          usingKeyboard && classes.usingKeyboard,
          referenceHidden && classes.referenceHidden,
        )}
        ref={setFloating}
        style={{ left: x, top: y, zIndex: 1500 }}
      >
        <span
          aria-expanded={expanded}
          className={classes.optionList}
          id={listboxId}
          role='listbox'
        >
          {options.map((option) => (
            <Option
              active={isOptionActive(option.value)}
              id={optionId(option.value)}
              key={option.value}
              multiple={multiple}
              onClick={onOptionClick}
              option={option}
              selected={isOptionSelected(option.value)}
            />
          ))}
        </span>
      </span>
    </FloatingPortal>
  );
};

OptionList.displayName = 'OptionList';

export { OptionList };
