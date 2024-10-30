import { useMergeRefs } from '@floating-ui/react';
import { XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useCallback, useRef, useState } from 'react';

import type { DefaultProps } from '../../../types';
import { omit } from '../../../utilities';
import { Button } from '../../Button/Button';
import { Input } from '../Input/Input';
import type { FormFieldProps } from '../useFormField';

export type SearchProps = {
  /** Variant
   * @default 'simple'
   */
  variant?: 'primary' | 'secondary' | 'simple';
  /** Callback for when clear button is activated */
  onClear?: (value: InputHTMLAttributes<HTMLInputElement>['value']) => void;
  /**Callback for Search-button submit */
  onSearchClick?: (value: string) => void;
  /** Search button label. Use this for providing a descriptive button text and/or icon
   * @default 'Søk'
   */
  searchButtonLabel?: ReactNode;
  /** Clear button label. Hidden visually. Used for screen readers
   * @default 'Tøm'
   */
  clearButtonLabel?: string;
  /** Exposes the HTML `size` attribute.
   * @default 27
   */
  htmlSize?: number;
} & Omit<
  FormFieldProps,
  'size' | 'description' | 'readOnly' | 'error' | 'errorId'
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'readOnly'> &
  DefaultProps &
  (
    | { 'aria-label': string; 'aria-labelledby'?: never; label?: never }
    | { 'aria-label'?: never; 'aria-labelledby'?: never; label: ReactNode }
    | { 'aria-label'?: never; 'aria-labelledby': string; label?: never }
  );

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
      className,
      'data-size': size,
      ...rest
    } = props;

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
      inputRef?.current?.focus();
    };

    const handleSearchClick = () => {
      onSearchClick?.((value ?? internalValue).toString());
    };

    const isSimple = variant === 'simple';
    const showClearButton = Boolean(value ?? internalValue) && !disabled;

    return (
      <div
        style={style}
        className={cl('ds-search', className)}
        data-size={size}
        data-variant={variant}
      >
        <Input
          ref={mergedRef}
          size={htmlSize}
          value={value ?? internalValue}
          disabled={disabled}
          {...omit(['size', 'error', 'errorId', 'readOnly'], rest)}
          type='search'
          onChange={handleChange}
        />
        {showClearButton && (
          <Button
            variant='secondary'
            type='reset'
            onClick={(e) => {
              e.preventDefault();
              handleClear();
            }}
            disabled={disabled}
            aria-label={clearButtonLabel}
          >
            <XMarkIcon aria-hidden />
          </Button>
        )}
        {!isSimple && (
          <Button
            className={'ds-search__search-button'}
            variant={variant}
            type='submit'
            onClick={handleSearchClick}
            disabled={disabled}
          >
            {searchButtonLabel}
          </Button>
        )}
      </div>
    );
  },
);

Search.displayName = 'Search';
