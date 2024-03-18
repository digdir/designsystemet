import type { ReactNode } from 'react';
import { useReducer } from 'react';
import cl from 'clsx';

import { LegacyCheckbox } from '../LegacyCheckbox';
import type { LegacyFieldSetProps } from '../LegacyFieldSet';
import { LegacyFieldSet } from '../LegacyFieldSet';
import {
  areItemsUnique,
  arraysEqual,
  objectValuesEqual,
} from '../../../utilities';
import { usePrevious, useUpdate } from '../../../hooks';
import type { LegacyCheckboxProps } from '../LegacyCheckbox';

import classes from './CheckboxGroup.module.css';

export type LegacyCheckboxGroupItem = Pick<
  LegacyCheckboxProps,
  | 'checked'
  | 'description'
  | 'disabled'
  | 'checkboxId'
  | 'label'
  | 'helpText'
  | 'hideLabel'
> &
  Required<Pick<LegacyCheckboxProps, 'name'>>;

export type CheckedNames = string[];

export interface LegacyCheckboxGroupProps {
  compact?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  items: LegacyCheckboxGroupItem[];
  legend?: ReactNode;
  onChange?: (names: CheckedNames) => void;
  presentation?: boolean;
  variant?: 'vertical' | 'horizontal';
  fieldSetProps?: Partial<LegacyFieldSetProps>;
}

type ReducerAction =
  | { type: 'check' | 'uncheck'; name: string }
  | { type: 'reset'; state: CheckedNames };

const reducer = (state: CheckedNames, action: ReducerAction) => {
  switch (action.type) {
    case 'check':
      return state.concat([action.name]);
    case 'uncheck':
      return state.filter((name) => name !== action.name);
    case 'reset':
      return action.state;
  }
};
const checkedItems = (items: LegacyCheckboxGroupItem[]) =>
  items.filter(({ checked }) => checked).map(({ name }) => name);

const LegacyCheckboxGroup = ({
  compact,
  description,
  disabled,
  error,
  helpText,
  items,
  legend,
  onChange,
  presentation,
  variant = 'vertical',
  fieldSetProps,
}: LegacyCheckboxGroupProps) => {
  if (!areItemsUnique(items.map((item) => item.name))) {
    throw Error('Each name in the checkbox group must be unique.');
  }

  const [checkedNames, dispatch] = useReducer(reducer, checkedItems(items));

  const prevItems = usePrevious([...items]);
  useUpdate(() => {
    if (
      items.length !== prevItems?.length ||
      items.some((item, index) => !objectValuesEqual(item, prevItems[index]))
    )
      dispatch({ type: 'reset', state: checkedItems(items) });
  });

  const prevCheckedNames = usePrevious(checkedNames);

  useUpdate(() => {
    onChange &&
      !disabled &&
      !arraysEqual(prevCheckedNames, checkedNames) &&
      onChange(checkedNames);
  }, [checkedNames, onChange, disabled]);

  return (
    <LegacyFieldSet
      contentClassName={cl(
        classes.checkboxGroup,
        classes[variant],
        compact && classes.compact,
      )}
      description={description}
      disabled={disabled}
      error={error}
      helpText={helpText}
      legend={legend}
      size={compact ? 'xsmall' : 'small'}
      {...fieldSetProps}
    >
      {items.map((item) => (
        <LegacyCheckbox
          checkboxId={item.checkboxId}
          checked={checkedNames.includes(item.name)}
          compact={compact}
          description={item.description}
          disabled={disabled || item.disabled}
          error={!!error}
          helpText={item.helpText}
          key={item.name}
          hideLabel={item.hideLabel}
          label={item.label}
          name={item.name}
          onChange={(event) => {
            dispatch({
              type: event.target.checked ? 'check' : 'uncheck',
              name: item.name,
            });
          }}
          presentation={presentation}
        />
      ))}
    </LegacyFieldSet>
  );
};

LegacyCheckboxGroup.displayName = 'LegacyCheckboxGroup';

/**
 *
 * @note
 * Replaced by new {@link https://storybook.designsystemet.no/?path=/docs/komponenter-checkbox-group--docs Checkbox.Group} component.
 */
export { LegacyCheckboxGroup };
