import { isValidElement } from 'react';
import type { ReactNode, ReactElement } from 'react';

import { ComboboxOption } from './Option/Option';
import { ComboboxCustom } from './Custom';
import type { ComboboxOptionProps } from './Option/Option';
import type { ComboboxCustomProps } from './Custom';

export function isComboboxOption(
  child: ReactNode,
): child is ReactElement<ComboboxOptionProps> {
  return isValidElement(child) && child.type === ComboboxOption;
}

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
