import { isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

import { ComboboxCustom } from './Custom';
import type { ComboboxCustomProps } from './Custom';

export function isComboboxCustom(
  child: ReactNode,
): child is ReactElement<ComboboxCustomProps> {
  return isValidElement(child) && child.type === ComboboxCustom;
}

export function isInteractiveComboboxCustom(
  child: ReactNode,
): child is ReactElement<ComboboxCustomProps> {
  return isComboboxCustom(child) && child.props.interactive === true;
}

const INTERNAL_OPTION_PREFIX = 'internal-option-';

/**
 * We use this function to prefix the value of the options so we can make sure numbers as strings are not parsed as numbers in objects
 * @param value
 * @returns
 */
export const prefix = (value?: string): string => {
  return INTERNAL_OPTION_PREFIX + value;
};

export const removePrefix = (value: string): string => {
  return value.slice(INTERNAL_OPTION_PREFIX.length);
};

// Workaround from https://github.com/equinor/design-system/blob/develop/packages/eds-utils/src/utils/setReactInputValue.ts
// React ignores 'dispathEvent' on input/textarea, see https://github.com/facebook/react/issues/10135
type ReactInternalHack = { _valueTracker?: { setValue: (a: string) => void } };

export const setReactInputValue = (
  input: HTMLInputElement & ReactInternalHack,
  value: string,
): void => {
  const previousValue = input.value;

  input.value = value;

  const tracker = input._valueTracker;

  if (typeof tracker !== 'undefined') {
    tracker.setValue(previousValue);
  }

  //'change' instead of 'input', see https://github.com/facebook/react/issues/11488#issuecomment-381590324
  input.dispatchEvent(new Event('change', { bubbles: true }));
};
