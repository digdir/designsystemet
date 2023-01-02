import React, { useId } from 'react';
import type { ReactNode } from 'react';
import cn from 'classnames';

import type { ReadOnlyVariant, InputVariant } from './utils';
import { getVariant } from './utils';
import { Icon } from './Icon';
import classes from './InputWrapper.module.css';

type InputRendererProps = {
  className: string;
  inputId: string;
  variant: InputVariant;
};

export interface InputWrapperProps {
  disabled?: boolean;
  inputId?: string;
  inputRenderer: (props: InputRendererProps) => ReactNode;
  isSearch?: boolean;
  isValid?: boolean;
  label?: string;
  noFocusEffect?: boolean;
  noPadding?: boolean;
  readOnly?: boolean | ReadOnlyVariant;
}

export const InputWrapper = ({
  disabled = false,
  inputId,
  inputRenderer,
  isSearch = false,
  isValid = true,
  label,
  noFocusEffect,
  noPadding,
  readOnly = false,
}: InputWrapperProps) => {
  const randomInputId = useId();
  const givenOrRandomInputId = inputId ?? randomInputId;

  const { variant, iconVariant } = getVariant({
    disabled,
    isSearch,
    isValid,
    readOnly,
  });

  return (
    <>
      {label && (
        <label
          className={classes.label}
          htmlFor={givenOrRandomInputId}
        >
          {label}
        </label>
      )}
      <div
        data-testid='InputWrapper'
        className={cn(
          classes.inputWrapper,
          classes[variant],
          {
            [classes.search]: isSearch,
            [classes.withFocusEffect]: !noFocusEffect,
            [classes.withPadding]: !noPadding,
          },
        )}
      >
        <Icon
          variant={iconVariant}
          disabled={disabled}
        />
        {inputRenderer({
          className: classes.field,
          inputId: givenOrRandomInputId,
          variant,
        })}
      </div>
    </>
  );
};
