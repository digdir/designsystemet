import type { ReactNode, InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { omit } from '../../../utils';
import { Label, Paragraph, ErrorMessage } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import { useSearch } from './useSearch';
import classes from './Search.module.css';
import utilityClasses from './../../../utils/utility.module.css';

export type SearchProps = {
  /** Label */
  label?: ReactNode;
  /** Visually hides `label` and `description` (still available for screen readers)  */
  hideLabel?: boolean;
  /** Changes field size and paddings */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
} & Omit<FormFieldProps, 'size' | 'description' | 'readOnly'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'readOnly'>;

/** Search field
 *
 * @example
 * ```tsx
 * <Search label="Search" label">
 * ```
 */
export const Search = forwardRef<HTMLInputElement, SearchProps>(
  (props, ref) => {
    const { label, style, hideLabel = true, ...rest } = props;

    const { inputProps, hasError, errorId, size = 'medium' } = useSearch(props);

    return (
      <Paragraph
        as='div'
        size={size}
        style={style}
        className={cn(
          classes.formField,
          inputProps.disabled && classes.disabled,
          rest.className,
        )}
      >
        {label && (
          <Label
            size={size}
            weight='medium'
            htmlFor={inputProps.id}
            className={cn(
              classes.label,
              hideLabel && utilityClasses.visuallyHidden,
            )}
          >
            <span>{label}</span>
          </Label>
        )}

        <input
          {...omit(['size', 'error', 'errorId', 'readOnly'], rest)}
          {...inputProps}
          className={cn(classes.input, utilityClasses.focusable, classes[size])}
          ref={ref}
        />
        <div
          className={classes.errorMessage}
          id={errorId}
          aria-live='polite'
          aria-relevant='additions removals'
        >
          {hasError && <ErrorMessage size={size}>{props.error}</ErrorMessage>}
        </div>
      </Paragraph>
    );
  },
);
