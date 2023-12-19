import React from 'react';
import cn from 'classnames';

import type { MultiSelectOption, SingleSelectOption } from '../types';

import classes from './OptionList.module.css';

type OptionPropsBase<T extends SingleSelectOption | MultiSelectOption> = {
  active: boolean;
  id: string;
  onClick: (value: string) => void;
  option: T;
  selected: boolean;
};

export type OptionProps =
  | (OptionPropsBase<SingleSelectOption> & { multiple: false })
  | (OptionPropsBase<MultiSelectOption> & { multiple: true });

const Option = ({
  active,
  id,
  multiple,
  onClick,
  option,
  selected,
}: OptionProps) => (
  <button
    aria-label={option.label}
    aria-selected={selected}
    className={cn(
      classes.option,
      selected && classes.selected,
      multiple && active && classes.focused,
    )}
    id={id}
    key={option.value}
    onClick={() => onClick(option.value)}
    onMouseDown={(event) => event.preventDefault()}
    onKeyDown={(event) => event.preventDefault()}
    role='option'
    type='button'
    value={option.value}
  >
    {option.formattedLabel ?? option.label}
  </button>
);

Option.displayName = 'Option';

export { Option };
