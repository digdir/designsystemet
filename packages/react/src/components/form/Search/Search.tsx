import type { ReactNode, InputHTMLAttributes, ChangeEvent } from 'react';
import { forwardRef, useCallback, useRef, useState } from 'react';
import cl from 'clsx';
import { MagnifyingGlassIcon, XMarkIcon } from '@navikt/aksel-icons';
import { useMergeRefs } from '@floating-ui/react';

import { omit } from '../../../utilities';
import { Button } from '../../Button';
import { Label, Paragraph, ErrorMessage } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import { useSearch } from './useSearch';

type OldSearchSizes = 'small' | 'medium' | 'large';

export type SearchProps = {
  /** Label */
  label?: ReactNode;
  /** Visually hides `label` and `description` (still available for screen readers)
   * @default true
   */
  hideLabel?: boolean;
  /**
   * Changes field size and paddings
   * @default md
   * @note `small`, `medium`, `large` is deprecated
   */
  size?: 'sm' | 'md' | 'lg' | OldSearchSizes;
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
      className,
      ...rest
    } = props;

    const { inputProps, hasError, errorId, size = 'md' } = useSearch(props);

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
        asChild
        size={size}
      >
        <div
          style={style}
          className={cl(
            'fds-search',
            inputProps.disabled && 'fds-search--disabled',
            `fds-search--${size}`,
            className,
          )}
        >
          {label && (
            <Label
              size={size}
              weight='medium'
              htmlFor={inputProps.id}
              className={cl('fds-search__label', hideLabel && 'fds-sr-only')}
            >
              <span>{label}</span>
            </Label>
          )}

          <div className={'fds-search__field'}>
            <div className={cl('fds-search__field', `fds-search--${size}`)}>
              {isSimple && (
                <MagnifyingGlassIcon
                  className={'fds-search__icon'}
                  aria-hidden
                ></MagnifyingGlassIcon>
              )}
              <input
                ref={mergedRef}
                size={htmlSize}
                value={value ?? internalValue}
                disabled={disabled}
                className={cl(
                  'fds-search__input',
                  `fds-focus`,
                  isSimple
                    ? 'fds-search__input--simple'
                    : 'fds-search__input--with-search-button',
                )}
                {...omit(['size', 'error', 'errorId', 'readOnly'], rest)}
                {...inputProps}
                onChange={handleChange}
              />
              {showClearButton && (
                <button
                  className={cl('fds-search__clear-button', `fds-focus`)}
                  type='button'
                  onClick={handleClear}
                  disabled={disabled}
                >
                  <span className={`fds-sr-only`}>{clearButtonLabel}</span>
                  <XMarkIcon aria-hidden />
                </button>
              )}
            </div>
            {!isSimple && (
              <Button
                className={'fds-search__search-button'}
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
            className={'fds-search__error-message'}
            id={errorId}
            aria-live='polite'
            aria-relevant='additions removals'
          >
            {hasError && <ErrorMessage size={size}>{props.error}</ErrorMessage>}
          </div>
        </div>
      </Paragraph>
    );
  },
);

Search.displayName = 'Search';
