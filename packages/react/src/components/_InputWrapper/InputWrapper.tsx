import React, { useId } from 'react';
import type { ReactNode } from 'react';
import cn from 'classnames';

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

export type CharLimitInformation = Omit<
  CharacterCounterDisplayProps,
  'ariaDescribedById'
>;

export interface InputWrapperProps {
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
  charLimitInformation?: CharLimitInformation;
}

export const InputWrapper = ({
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
  charLimitInformation,
}: InputWrapperProps) => {
  const randomInputId = useId();
  const givenOrRandomInputId = inputId ?? randomInputId;

  const charLimitDescriptionId = useId();

  const { variant, iconVariant } = getVariant({
    disabled,
    isSearch,
    isValid,
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
      {charLimitInformation && (
        <CharacterCounterDisplay
          {...charLimitInformation}
          ariaDescribedById={charLimitDescriptionId}
        />
      )}
    </>
  );
};

/**
 * Renders a character counter display that indicates the remaining character limit
 * and whether the limit has been exceeded. This component ensures that the accessibility is taken care of.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.hasExceededCharLimit - Whether the character limit has been exceeded.
 * @param {string} props.screenReaderMaxCharDescription - The description of the maximum character limit for screen readers.
 * @param {string} props.remainingCharLimitMessage - The message indicating the remaining character limit.
 * @param {string} props.ariaDescribedById - The ID of the element that describes the maximum character limit for accessibility purposes.
 * @returns {JSX.Element} The rendered component.
 */
type CharacterCounterDisplayProps = {
  hasExceededCharLimit: boolean;
  screenReaderMaxCharDescription: string;
  remainingCharLimitMessage: string;
  ariaDescribedById: string;
};
const CharacterCounterDisplay = ({
  remainingCharLimitMessage,
  hasExceededCharLimit,
  screenReaderMaxCharDescription,
  ariaDescribedById,
}: CharacterCounterDisplayProps): JSX.Element => (
  <>
    <span
      className={classes.screenReaderOnly}
      id={ariaDescribedById}
    >
      {screenReaderMaxCharDescription}
    </span>
    <div
      className={[
        classes.remainingCharLimitMessage,
        hasExceededCharLimit ? classes.charLimitExceeded : '',
      ].join(' ')}
      aria-live={hasExceededCharLimit ? 'polite' : 'off'}
    >
      {remainingCharLimitMessage}
    </div>
  </>
);
