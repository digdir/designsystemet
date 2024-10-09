import cl from 'clsx/lite';
import { forwardRef, isValidElement, memo, useContext, useId } from 'react';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

import { omit } from '../../../../utilities/omit/omit';
import { Label } from '../../../Label';
import { ComboboxContext } from '../ComboboxContext';

import ComboboxOptionDescription from './Description';
import { SelectedIcon } from './SelectedIcon';
import { useComboboxOption } from './useComboboxOption';

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
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ComboboxOption = memo(
  forwardRef<HTMLButtonElement, ComboboxOptionProps>(
    ({ value, description, children, className, ...rest }, forwardedRef) => {
      const labelId = useId();

      const { id, ref, selected, active, onOptionClick } = useComboboxOption({
        id: rest.id,
        ref: forwardedRef,
        value,
      });

      const context = useContext(ComboboxContext);
      if (!context) {
        throw new Error('ComboboxOption must be used within a Combobox');
      }
      const { size, multiple, getItemProps } = context;

      const props = getItemProps();

      return (
        <Label size='md' asChild>
          <button
            ref={ref}
            id={id}
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role='option'
            type='button'
            aria-selected={!!selected}
            aria-labelledby={labelId}
            tabIndex={-1}
            onClick={(e) => {
              onOptionClick();
              rest.onClick?.(e);
            }}
            className={cl(
              'ds-combobox__option',
              active && 'ds-combobox__option--active',
              multiple && 'ds-combobox__option--multiple',
              className,
            )}
            {...omit(['displayValue'], rest)}
            {...omit(['onClick', 'onPointerLeave'], props)}
          >
            <Label asChild size={size}>
              <span>
                <SelectedIcon multiple={multiple} selected={!!selected} />
              </span>
            </Label>
            <Label
              className={'ds-combobox__option__label'}
              size={size}
              id={labelId}
            >
              {children}
              {description && (
                <ComboboxOptionDescription>
                  {description}
                </ComboboxOptionDescription>
              )}
            </Label>
          </button>
        </Label>
      );
    },
  ),
);

ComboboxOption.displayName = 'ComboboxOption';

export { ComboboxOption };

export function isComboboxOption(
  child: ReactNode,
): child is ReactElement<ComboboxOptionProps> {
  return isValidElement(child) && child.type === ComboboxOption;
}
