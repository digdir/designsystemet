import type { ReactNode, InputHTMLAttributes, ChangeEvent } from 'react';
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import { MagnifyingGlassIcon, XMarkIcon } from '@navikt/aksel-icons';
import { useMergeRefs } from '@floating-ui/react';

import { omit } from '../../../utils';
import { Button } from '../../Button';
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
  size?: 'small' | 'medium' | 'large';
  /** Variant */
  variant?: 'primary' | 'secondary' | 'simple';
  /** Callback for when clear button is activated */
  onClear?: (value: InputHTMLAttributes<HTMLInputElement>['value']) => void;
  /**Callback for Search-button submit */
  onSearchClick?: (value: string) => void;
  /** Search button label. Use this for providing a descriptive button text and/or icon */
  searchButtonLabel?: ReactNode;
  /** Clear button label. Hidden visually. Used for screen readers */
  clearButtonLabel?: string;
  /** Exposes the HTML `size` attribute. */
  htmlSize?: number;
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
    const {
      label,
      style,
      hideLabel = true,
      variant = 'simple',
      searchButtonLabel = 'Søk',
      clearButtonLabel = 'Tøm',
      defaultValue,
      value,
      onChange,
      onClear,
      disabled,
      onSearchClick,
      htmlSize = 27,
      ...rest
    } = props;

    const { inputProps, hasError, errorId, size = 'medium' } = useSearch(props);

    const inputRef = useRef<HTMLInputElement>();
    const mergedRef = useMergeRefs([ref, inputRef]);

    const [internalValue, setInternalValue] = useState(defaultValue ?? '');

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        value === undefined && setInternalValue(newValue);
        onChange?.(e);
      },
      [onChange, value],
    );

    const handleClear = () => {
      onClear?.(internalValue);
      setInternalValue('');
      inputRef?.current && inputRef.current.focus();
    };

    const handleSearchClick = () => {
      onSearchClick?.((value ?? internalValue).toString());
    };

    const isSimple = variant === 'simple';
    const showClearButton = Boolean(value ?? internalValue) && !disabled;

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

        <div className={classes.field}>
          <div className={classes.field}>
            {isSimple && (
              <MagnifyingGlassIcon
                className={classes.icon}
                aria-hidden
              ></MagnifyingGlassIcon>
            )}
            <input
              {...omit(['size', 'error', 'errorId', 'readOnly'], rest)}
              {...inputProps}
              ref={mergedRef}
              size={htmlSize}
              value={value ?? internalValue}
              onChange={handleChange}
              disabled={disabled}
              className={cn(
                classes.input,
                utilityClasses.focusable,
                classes[size],
                isSimple && classes.simple,
                !isSimple && classes.withSearchButton,
              )}
            />
            {showClearButton && (
              <button
                className={cn(classes.clearButton, utilityClasses.focusable)}
                type='button'
                onClick={handleClear}
                disabled={disabled}
              >
                <span className={utilityClasses.visuallyHidden}>
                  {clearButtonLabel}
                </span>
                <XMarkIcon aria-hidden />
              </button>
            )}
          </div>
          {!isSimple && (
            <Button
              className={classes.searchButton}
              size={size}
              variant={variant}
              type='submit'
              onClick={handleSearchClick}
              disabled={disabled}
            >
              {searchButtonLabel}
            </Button>
          )}
        </div>

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
