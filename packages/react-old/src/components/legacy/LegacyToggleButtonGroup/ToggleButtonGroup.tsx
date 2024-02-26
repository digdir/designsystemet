import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import cl from 'clsx';

import { areItemsUnique } from '../../../utilities';

import classes from './ToggleButtonGroup.module.css';

export interface LegacyToggleButtonProps {
  /**
   * The value of the toggle button. The onChange function will be called with this value when the button is selected.
   */
  value: string;

  /**
   * The visible label of the toggle button.
   */
  label: ReactNode;
}

export interface LegacyToggleButtonGroupProps {
  /**
   * The list of toggle buttons to render.
   */
  items: LegacyToggleButtonProps[];

  /**
   * Optional function to be called when the selected value changes.
   * @param selectedValue The new selected value.
   * @returns void
   */
  onChange?: (selectedValue: string) => void;

  /**
   * The default selected value. This can also be used to control the selected value from the outside of the component.
   */
  selectedValue?: string;
}

/**
 * Component for rendering a group of toggle buttons. At any given time, only one button in the group can be selected.
 */
export const LegacyToggleButtonGroup = ({
  onChange,
  items,
  selectedValue,
}: LegacyToggleButtonGroupProps) => {
  const initiallySelected = selectedValue ?? items[0].value;
  const [selected, setSelected] = useState(initiallySelected);

  useEffect(() => {
    setSelected(initiallySelected);
  }, [initiallySelected]);

  if (!areItemsUnique(items.map(({ value }) => value))) {
    throw Error('Each value must be unique.');
  }
  if (
    selectedValue !== undefined &&
    !items.some((item) => item.value === selectedValue)
  ) {
    throw Error(
      'The given selected item value must exist in the list of items.',
    );
  }

  const handleChange = (value: string) => {
    setSelected(value);
    onChange && onChange(value);
  };

  return (
    <span className={classes.toggleButtonGroup}>
      {items.map((item) => (
        <button
          aria-pressed={item.value === selected}
          className={cl(
            classes.toggleButton,
            item.value === selected && classes.pressed,
          )}
          key={item.value}
          onClick={() => handleChange(item.value)}
          type='button'
        >
          {item.label}
        </button>
      ))}
    </span>
  );
};
