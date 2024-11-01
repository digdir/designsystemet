import { useMergeRefs } from '@floating-ui/react';
import cl from 'clsx/lite';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useRef, useState } from 'react';

import type { DefaultProps } from '../../../types';
import { omit } from '../../../utilities';
import { Button } from '../../Button/Button';
import { setReactInputValue } from '../Combobox/utilities';
import { Input } from '../Input/Input';
import type { FormFieldProps } from '../useFormField';

export type SearchProps = {
  /** Variant
   * @default 'simple'
   */
  variant?: 'primary' | 'secondary' | 'simple';
  /**Callback for Search-button submit */
  onSearchClick?: (value: string) => void;
  /** Search button label. Use this for providing a descriptive button text and/or icon
   * @default 'Søk'
   */
  searchButtonLabel?: ReactNode;
  /**
   * Clear button label. Hidden visually. Used for screen readers.
   * Set to `null` to hide the button from screen readers.
   *
   * @default 'Tøm'
   */
  clearButtonLabel?: string;
} & Omit<FormFieldProps, 'description' | 'readOnly' | 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'readOnly' | 'type'> &
  DefaultProps &
  (
    | { 'aria-label': string; 'aria-labelledby'?: never }
    | { 'aria-label'?: never; 'aria-labelledby': string }
  );

/** Search field
 *
 * @example
 * ```tsx
 * <Search aria-label="Search" />
 * ```
 */
export const Search = forwardRef<HTMLInputElement, SearchProps>(
  (props, ref) => {
    const {
      style,
      variant = 'simple',
      searchButtonLabel = 'Søk',
      clearButtonLabel = 'Tøm',
      defaultValue,
      value,
      onChange,
      disabled,
      onSearchClick,
      className,
      'data-size': size,
      ...rest
    } = props;
    const inputRef = useRef<HTMLInputElement>();
    const mergedRef = useMergeRefs([ref, inputRef]);

    const [internalValue, setInternalValue] = useState(defaultValue ?? '');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      value === undefined && setInternalValue(e.target.value);
    };

    const handleClear = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      if (!inputRef.current) throw new Error('Input ref is missing');
      e.preventDefault();
      setReactInputValue(inputRef.current, '');
      inputRef?.current?.focus();
    };

    const handleSearchClick = () => {
      onSearchClick?.((value ?? internalValue).toString());
    };

    const showClearButton =
      Boolean(value ?? internalValue) &&
      !disabled &&
      typeof searchButtonLabel === 'string';

    return (
      <div
        style={style}
        className={cl('ds-search', className)}
        data-size={size}
        data-variant={variant}
      >
        <Input
          ref={mergedRef}
          value={value ?? internalValue}
          disabled={disabled}
          {...omit(['error', 'errorId', 'readOnly'], rest)}
          type='search'
          onChange={handleChange}
        />
        {showClearButton && (
          <Button
            variant='secondary'
            type='reset'
            onClick={handleClear}
            disabled={disabled}
            aria-label={clearButtonLabel}
          />
        )}
        <Button
          variant={variant === 'primary' ? 'primary' : 'secondary'}
          type='submit'
          onClick={handleSearchClick}
          disabled={disabled}
        >
          {searchButtonLabel}
        </Button>
      </div>
    );
  },
);

Search.displayName = 'Search';
