import React, {
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
} from 'react';
import cn from 'classnames';
import { useMergeRefs } from '@floating-ui/react';
import { CheckmarkIcon } from '@navikt/aksel-icons';

import { ComboboxContext } from '../Combobox';
import { Label, Paragraph } from '../../../Typography';
// import ComboboxCheckbox from '../internal/ComboboxCheckbox';
import { omit } from '../../../../utilities';

import classes from './Option.module.css';
import ComboboxOptionDescription from './Description/Description';

export type ComboboxOptionProps = {
  /**
   * The value returned when the option is selected
   */
  value: string;
  /**
   * The index of the option in the list, will be overwritten by Combobox.
   */
  description?: string;
  /**
   * The text displayed in the input or in the chips when the option is selected.
   * Required if children is not composed of strings only.
   */
  displayValue?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ComboboxOption = forwardRef<
  HTMLButtonElement,
  ComboboxOptionProps
>(({ value, description, children, ...rest }, ref) => {
  const labelId = useId();
  const generatedId = useId();

  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error('ComboboxOption must be used within a Combobox');
  }
  const {
    selectedOptions,
    activeIndex,
    setActiveOption,
    onOptionClick,
    multiple,
    size,
    listRef,
    optionValues,
  } = context;

  const index = useMemo(
    () => optionValues.indexOf(value),
    [optionValues, value],
  );

  const combinedRef = useMergeRefs([
    (node: HTMLElement | null) => {
      listRef.current[index] = node;
    },
    ref,
  ]);

  if (index === -1) {
    throw new Error('Internal error: ComboboxOption did not find index');
  }

  const selected = selectedOptions.find((option) => option.value === value);

  useEffect(() => {
    if (activeIndex === index) setActiveOption(index, rest.id || generatedId);
  }, [activeIndex, generatedId, index, rest.id, setActiveOption]);

  // const icon = useMemo(() => {
  //   return (
  //     <ComboboxCheckbox
  //       size={size}
  //       checked={!!selected}
  //       className={classes.checkbox}
  //     />
  //   );
  // }, [selected, size]);

  return (
    <button
      {...omit(['displayValue'], rest)}
      id={rest.id || generatedId}
      role='option'
      type='button'
      aria-selected={activeIndex === index}
      aria-labelledby={labelId}
      onClick={(e) => {
        onOptionClick(value);
        rest.onClick?.(e);
      }}
      onMouseEnter={(e) => {
        setActiveOption(index, labelId);
        rest.onMouseEnter?.(e);
      }} // Set active index on hover
      onFocus={(e) => {
        setActiveOption(index, labelId);
        rest.onFocus?.(e);
      }} // Set active index on focus
      className={cn(
        classes.option,
        activeIndex === index && classes.active,
        rest.className,
      )}
      ref={combinedRef}
    >
      {/* {multiple && icon} */}
      <Label
        as='span'
        size={size}
      >
        {selected && (
          <CheckmarkIcon
            className={classes.selectIcon}
            aria-hidden
          />
        )}
      </Label>
      <Label
        className={classes.optionText}
        size={size}
        id={labelId}
      >
        {children}
        {description && (
          <ComboboxOptionDescription>{description}</ComboboxOptionDescription>
        )}
      </Label>
    </button>
  );
});
