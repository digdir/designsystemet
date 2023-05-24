import React, { useId } from 'react';
import type { ReactNode } from 'react';
import cn from 'classnames';

import utilityClasses from '../../utils/utility.module.css';

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

export type CharacterLimit = Omit<
  CharacterCounterProps,
  'ariaDescribedById' | 'value'
>;

export type InputWrapperProps = {
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
  /**
   *  The characterLimit function calculates remaining characters.
   *  Provide a `label` function that takes count as parameter and returns a message.
   *  Use `srLabel` to describe `maxCount` for screen readers.
   */
  characterLimit?: CharacterLimit;
  value?: string | number | readonly string[] | undefined;
};

export const InputWrapper = ({
  className = '',
  disabled = false,
  inputId,
  inputRenderer,
  isSearch = false,
  isValid = true,
  label,
  noFocusEffect,
  noPadding,
  readOnly = false,
  characterLimit,
  value,
}: InputWrapperProps) => {
  const randomInputId = useId();
  const givenOrRandomInputId = inputId ?? randomInputId;

  const characterLimitDescriptionId = useId();
  const currentInputValue = value ? value.toString() : '';
  const { variant, iconVariant } = getVariant({
    disabled,
    isSearch,
    isValid: characterLimit
      ? currentInputValue.length < characterLimit.maxCount && isValid
      : isValid,
    readOnly,
  });

  const hasIcon = iconVariant !== 'none';

  return (
    <div>
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
            [classes.withPadding]: !noPadding,
          })}
        >
          <Icon
            variant={iconVariant}
            disabled={disabled}
          />
          {inputRenderer({
            className: cn(
              classes.field,
              !noFocusEffect && utilityClasses.focusable,
              className,
            ),
            hasIcon,
            inputId: givenOrRandomInputId,
            variant,
            describedBy: characterLimitDescriptionId,
          })}
        </span>
      </span>
      {characterLimit && (
        <div className={classes.characterLimitContainer}>
          <CharacterCounter
            {...characterLimit}
            value={currentInputValue}
            ariaDescribedById={characterLimitDescriptionId}
          />
        </div>
      )}
    </div>
  );
};

type CharacterCounterProps = {
  /** The message indicating the remaining character limit. */
  label: (count: number) => string;
  /** The description of the maximum character limit for screen readers. */
  srLabel: string;
  /** The maximum allowed character count. */
  maxCount: number;
  /** The current value. */
  value: string;
  /** The ID of the element that describes the maximum character limit for accessibility purposes. */
  ariaDescribedById: string;
};
const CharacterCounter = ({
  label,
  srLabel,
  maxCount,
  value,
  ariaDescribedById,
}: CharacterCounterProps): JSX.Element => {
  const currentCount = maxCount - value.length;
  const hasExceededLimit = value.length > maxCount;

  return (
    <>
      <span
        className={utilityClasses.visuallyHidden}
        id={ariaDescribedById}
      >
        {srLabel}
      </span>
      <div
        className={[
          classes.characterLimitLabel,
          hasExceededLimit ? classes.characterLimitExceeded : '',
        ].join(' ')}
        aria-live={hasExceededLimit ? 'polite' : 'off'}
      >
        {label(currentCount)}
      </div>
    </>
  );
};
