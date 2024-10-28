import { useMergeRefs } from '@floating-ui/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useCallback, useRef, useState } from 'react';

import type { DefaultProps } from '../../../types';
import { omit } from '../../../utilities';
import { Button } from '../../Button/Button';
import { Label } from '../../Label';
import { Paragraph } from '../../Paragraph';
import type { FormFieldProps } from '../useFormField';

import { useSearch } from './useSearch';

export type SearchProps = {
  /** Label */
  label?: ReactNode;
  /** Visually hides `label` and `description` (still available for screen readers)
   * @default true
   */
  hideLabel?: boolean;
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
  DefaultProps;

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
      className,
      ...rest
    } = props;

    const { inputProps, size = 'md' } = useSearch(props);

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
      <Paragraph asChild data-size={size}>
        <div
          style={style}
          className={cl(
            'ds-search',
            inputProps.disabled && 'ds-search--disabled',
            `ds-search--${size}`,
            className,
          )}
        >
          {label && (
            <Label
              data-size={size}
              weight='medium'
              htmlFor={inputProps.id}
              className={cl('ds-search__label', hideLabel && 'ds-sr-only')}
            >
              <span>{label}</span>
            </Label>
          )}

          <div className={'ds-search__field'}>
            <div className={cl('ds-search__field', `ds-search--${size}`)}>
              {isSimple && (
                <MagnifyingGlassIcon
                  className={'ds-search__icon'}
                  aria-hidden
                ></MagnifyingGlassIcon>
              )}
              <input
                ref={mergedRef}
                size={htmlSize}
                value={value ?? internalValue}
                disabled={disabled}
                className={cl(
                  'ds-search__input',
                  `ds-focus`,
                  isSimple
                    ? 'ds-search__input--simple'
                    : 'ds-search__input--with-search-button',
                )}
                {...omit(['size', 'error', 'errorId', 'readOnly'], rest)}
                {...inputProps}
                onChange={handleChange}
              />
              {showClearButton && (
                <button
                  className={cl('ds-search__clear-button', `ds-focus`)}
                  type='button'
                  onClick={handleClear}
                  disabled={disabled}
                >
                  <span className={`ds-sr-only`}>{clearButtonLabel}</span>
                  <XMarkIcon aria-hidden />
                </button>
              )}
            </div>
            {!isSimple && (
              <Button
                className={'ds-search__search-button'}
                data-size={size}
                variant={variant}
                type='submit'
                onClick={handleSearchClick}
                disabled={disabled}
              >
                {searchButtonLabel}
              </Button>
            )}
          </div>
        </div>
      </Paragraph>
    );
  },
);

Search.displayName = 'Search';
