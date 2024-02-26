import { useId } from 'react';
import type { ReactNode } from 'react';
import cl from 'clsx';
import { ErrorMessage, Paragraph } from '@digdir/designsystemet-react';

import utilityClasses from '../utility.module.css';

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
  /** A class name to apply to the wrapper element */
  className?: string;

  /** Set to true if the wrapped element is in the disabled state to apply proper styling. */
  disabled?: boolean;

  /** The ID of the wrapper element */
  id?: string;

  /** The ID of the wrapped element. InputWrapper will generate a random value for this if it is not provided. */
  inputId?: string;

  /** Function that renders the wrapped element. */
  inputRenderer: (props: InputRendererProps) => ReactNode;

  /** Set to true if the wrapped element is a search input. */
  isSearch?: boolean;

  /** Set to true to indicate that there is an error related to the input value. */
  isValid?: boolean;

  /** The label for the wrapped element. */
  label?: string;

  /**
   * Set to true to disable the focus effect.
   * Use this if focus effects are handled internally in the wrapped element,
   * i.e. if it contains several focusable components.
   * */
  noFocusEffect?: boolean;

  /** Set to true to remove the default padding from the wrapper element. */
  noPadding?: boolean;

  /** Set to true if the wrapped element is in read-only mode to apply proper styling. */
  readOnly?: boolean | ReadOnlyVariant_;

  /** Add to list of ids for use in `inputRenderer` and `aria-describedby`. */
  ariaDescribedBy?: string;

  /**
   *  The characterLimit function calculates remaining characters.
   *  Provide a `label` function that takes count as parameter and returns a message.
   *  Use `srLabel` to describe `maxCount` for screen readers.
   */
  characterLimit?: CharacterLimit;

  /**
   * The value of the wrapped element.
   * This must be set if the characterLimit functionality is used.
   */
  value?: string | number | readonly string[] | undefined;
};

/**
 * @deprecated Legacy component
 */
export const InputWrapper = ({
  className = '',
  disabled = false,
  id,
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
  ariaDescribedBy,
}: InputWrapperProps) => {
  const randomInputId = useId();
  const givenOrRandomInputId = inputId ?? randomInputId;

  const autoCharLimitIdGenerated = useId();
  const characterLimitDescriptionId = characterLimit
    ? autoCharLimitIdGenerated
    : undefined;
  const currentInputValue = value ? value.toString() : '';

  const { variant, iconVariant } = getVariant({
    disabled,
    isSearch,
    isValid,
    readOnly,
  });

  const hasIcon = iconVariant !== 'none';

  const buildAriaDescribedBy = (
    ids: (string | undefined)[],
  ): string | undefined => {
    return ids.filter(Boolean).join(' ') || undefined;
  };

  return (
    <span
      id={id}
      className={className}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <span className={cl(classes.inputAndLabel, hasIcon && classes.withIcon)}>
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
          className={cl(classes.inputWrapper, classes[variant], {
            [classes.search]: isSearch,
            [classes.withPadding]: !noPadding,
          })}
        >
          <Icon
            variant={iconVariant}
            disabled={disabled}
          />
          {inputRenderer({
            className: cl(
              classes.field,
              !noFocusEffect && utilityClasses.focusable,
            ),
            hasIcon,
            inputId: givenOrRandomInputId,
            variant,
            describedBy: buildAriaDescribedBy([
              ariaDescribedBy,
              characterLimitDescriptionId,
            ]),
          })}
        </span>
      </span>
      {characterLimit && characterLimitDescriptionId && (
        <CharacterCounter
          {...characterLimit}
          value={currentInputValue}
          ariaDescribedById={characterLimitDescriptionId}
        />
      )}
    </span>
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
      <span className={classes.characterLimitLabel}>
        {hasExceededLimit ? (
          <ErrorMessage
            asChild
            size='small'
          >
            <span aria-live='polite'>{label(currentCount)}</span>
          </ErrorMessage>
        ) : (
          <Paragraph
            asChild
            size='small'
          >
            <span>{label(currentCount)}</span>
          </Paragraph>
        )}
      </span>
    </>
  );
};
