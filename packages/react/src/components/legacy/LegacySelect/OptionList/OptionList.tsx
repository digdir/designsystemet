import { useId, useRef, useState } from 'react';
import { FloatingPortal } from '@floating-ui/react';
import cl from 'clsx';

import { useEventListener } from '../../../../hooks';
import type {
  LegacyMultiSelectOption,
  LegacySingleSelectOption,
} from '../types';

import classes from './OptionList.module.css';
import { Option } from './Option';

type OptionListPropsBase<
  T extends LegacySingleSelectOption | LegacyMultiSelectOption,
> = {
  activeValue?: string;
  expanded: boolean;
  listboxId: string;
  onOptionClick: (value: string) => void;
  optionId: (value: string) => string;
  options: T[];
  selectedValues: string[];
  setFloating: (node: HTMLElement | null) => void;
  x: number;
  y: number;
  portal: boolean;
};

export type OptionListProps =
  | (OptionListPropsBase<LegacySingleSelectOption> & { multiple: false })
  | (OptionListPropsBase<LegacyMultiSelectOption> & { multiple: true });

const OptionList = ({
  activeValue,
  expanded,
  listboxId,
  multiple,
  onOptionClick,
  optionId,
  options,
  selectedValues,
  setFloating,
  x,
  y,
  portal,
}: OptionListProps) => {
  const portalRef = useRef<HTMLDivElement>(null);
  const portalId = useId();
  const [usingKeyboard, setUsingKeyboard] = useState<boolean>(false);
  useEventListener('click', () => setUsingKeyboard(false));
  useEventListener('keydown', () => setUsingKeyboard(true));

  const isOptionActive = (val: string) => activeValue === val;
  const isOptionSelected = (val: string) =>
    multiple ? selectedValues.includes(val) : isOptionActive(val);

  return (
    <>
      <div ref={portalRef}></div>
      <FloatingPortal
        id={`fds-select-${portalId}`}
        root={portal ? null : portalRef}
      >
        <span
          className={cl(
            classes.wrapper,
            expanded && classes.expanded,
            usingKeyboard && classes.usingKeyboard,
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
    </>
  );
};

OptionList.displayName = 'OptionList';

export { OptionList };
