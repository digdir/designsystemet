import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { useMergeRefs } from '@floating-ui/react';

import { omit } from '../../../utilities';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import classes from './Checkbox.module.css';
import { useCheckbox } from './useCheckbox';

export type CheckboxProps = {
  /** Checkbox label */
  children?: ReactNode;
  /** Value of the `input` element */
  value: string;
  /**Toggle indeterminate state for Checkbox
   * @default false
   */
  indeterminate?: boolean;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const { children, description, className, style, ...rest } = props;
    const {
      inputProps,
      descriptionId,
      hasError,
      size = 'medium',
      readOnly,
    } = useCheckbox(props);

    const inputRef = useMergeRefs<HTMLInputElement>([
      ref,
      (el) => {
        if (el) {
          el.indeterminate = rest.indeterminate ?? false;
        }
      },
    ]);

    return (
      <Paragraph
        asChild
        size={size}
      >
        <div
          className={cl(
            classes.container,
            classes[size],
            inputProps.disabled && classes.disabled,
            hasError && classes.error,
            readOnly && classes.readonly,
            className,
          )}
          style={style}
        >
          <input
            className={classes.input}
            ref={inputRef}
            {...omit(['size', 'error', 'indeterminate'], rest)}
            {...inputProps}
            type='checkbox'
            aria-checked={rest.indeterminate ? 'mixed' : inputProps.checked}
          />
          <Label
            className={classes.label}
            htmlFor={inputProps.id}
            size={size}
            weight='regular'
          >
            <span>{children}</span>
          </Label>
          {description && (
            <Paragraph
              asChild
              size={size}
            >
              <div
                id={descriptionId}
                className={classes.description}
              >
                {description}
              </div>
            </Paragraph>
          )}
        </div>
      </Paragraph>
    );
  },
);

Checkbox.displayName = 'Checkbox';
