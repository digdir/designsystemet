import React, { useId } from 'react';
import type { ReactNode, ForwardedRef } from 'react';
import cn from 'classnames';

import utilClasses from '../../utils/utility.module.css';

import type { ReadOnlyVariant_, InputVariant_ } from './utils';
import { getVariant } from './utils';
import { Icon } from './Icon';
import classes from './InputWrapper.module.css';

type InputRendererProps = {
  className: string;
  hasIcon: boolean;
  inputId: string;
  variant: InputVariant_;
  value?: string;
  describedBy?: string;
};

export type CharLimit = Omit<
  CharacterCounterProps,
  'ariaDescribedById' | 'value'
>;

export type InputWrapperProps<T> = {
  className?: string;
  disabled?: boolean;
  inputId?: string;
  inputRenderer: (props: InputRendererProps) => ReactNode;
  isSearch?: boolean;
  isValid?: boolean;
  label?: string;
  noFocusEffect?: boolean;
  noPadding?: boolean;
  readOnly?: boolean | ReadOnlyVariant_;
  charLimit?: CharLimit;
  value?: string | number | readonly string[] | undefined;
  ref?: ForwardedRef<T>;
};

export const InputWrapper = <T,>({
  className,
  disabled = false,
  inputId,
  inputRenderer,
  isSearch = false,
  isValid = true,
  label,
  noFocusEffect,
  noPadding,
  readOnly = false,
  charLimit,
  value,
}: InputWrapperProps<T>) => {
  const randomInputId = useId();
  const givenOrRandomInputId = inputId ?? randomInputId;

  const charLimitDescriptionId = useId();
  const currentInputValue = value ? `${value}` : '';
  const { variant, iconVariant } = getVariant({
    disabled,
    isSearch,
    isValid: charLimit
      ? isValid && currentInputValue.length > charLimit.maxCount
      : isValid,
    readOnly,
  });

  const hasIcon = iconVariant !== 'none';

  return (
    <>
      <span className={cn(classes.inputAndLabel, hasIcon && classes.withIcon)}>
        {label && (
          <label
            className={classes.label}
            htmlFor={givenOrRandomInputId}
          >
            {label}
          </label>
        )}
        <span
          data-testid='InputWrapper'
          className={cn(classes.inputWrapper, classes[variant], {
            [classes.search]: isSearch,
            [classes.withFocusEffect]: !noFocusEffect,
            [classes.withPadding]: !noPadding,
          })}
        >
          <Icon
            variant={iconVariant}
            disabled={disabled}
          />
          {inputRenderer({
            className: `${classes.field} ${className || ''}`,
            hasIcon,
            inputId: givenOrRandomInputId,
            variant,
            describedBy: charLimitDescriptionId,
          })}
        </span>
      </span>
      {charLimit && (
        <CharacterCounter
          {...charLimit}
          value={currentInputValue}
          ariaDescribedById={charLimitDescriptionId}
        />
      )}
    </>
  );
};

type CharacterCounterProps = {
  /* The message indicating the remaining character limit. */
  label: (count: number) => string;
  /*The description of the maximum character limit for screen readers.*/
  srLabel: string;
  /* maxCount - The maximum allowed character count. */
  maxCount: number;
  /* value - the current value */
  value: string;
  /*The ID of the element that describes the maximum character limit for accessibility purposes */
  ariaDescribedById: string;
};
const CharacterCounter = ({
  label,
  srLabel,
  maxCount,
  value,
  ariaDescribedById,
}: CharacterCounterProps): JSX.Element => {
  const currentCount = value.length;
  const hasExceededLimit = currentCount >= maxCount;

  return (
    <>
      <span
        className={utilClasses.visuallyHidden}
        id={ariaDescribedById}
      >
        {srLabel}
      </span>
      <div
        className={[
          classes.charLimitLabel,
          hasExceededLimit ? classes.charLimitExceeded : '',
        ].join(' ')}
        aria-live={hasExceededLimit ? 'polite' : 'off'}
      >
        {label(currentCount)}
      </div>
    </>
  );
};
