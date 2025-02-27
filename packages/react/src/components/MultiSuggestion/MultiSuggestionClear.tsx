import { forwardRef, useContext } from 'react';
import { Button, type ButtonProps } from '../Button';
import { MultiSuggestionContext } from './MultiSuggestion';

/* We omit children since we render the icon with css */
export type MultiSuggestionClearProps = Omit<
  ButtonProps,
  'variant' | 'children'
> & {
  /**
   * Aria label for the clear button
   * @default 'Tøm'
   */
  'aria-label'?: string;
};

/**
 * Component that provides a clear button for the MultiSuggestion input.
 *
 * Place as a descendant of `MultiSuggestion`
 *
 * @example
 * <MultiSuggestion>
 *   <MultiSuggestion.Input />
 *   <MultiSuggestion.Clear />
 *   <MultiSuggestion.List />
 * </MultiSuggestion>
 */
export const MultiSuggestionClear = forwardRef<
  HTMLButtonElement,
  MultiSuggestionClearProps
>(function MultiSuggestionClear(
  { 'aria-label': label = 'Tøm', onClick, ...rest },
  ref,
) {
  const { inputRef } = useContext(MultiSuggestionContext); //, handleValueChange

  const handleClear = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!inputRef?.current) throw new Error('Input is missing');
    /* narrow type to make TS happy */
    if (!(inputRef?.current instanceof HTMLInputElement))
      throw new Error('Input is not an input element');

    event.preventDefault();
    setReactInputValue(inputRef.current, '');
    inputRef.current.focus();
    onClick?.(event);
  };

  return (
    <Button
      ref={ref}
      variant='tertiary'
      type='reset'
      aria-label={label}
      onClick={handleClear}
      icon={true}
      {...rest}
    />
  );
});

// Workaround from https://github.com/equinor/design-system/blob/develop/packages/eds-utils/src/utils/setReactInputValue.ts
// React ignores 'dispathEvent' on input/textarea, see https://github.com/facebook/react/issues/10135
type ReactInternalHack = { _valueTracker?: { setValue: (a: string) => void } };

// Copied from https://github.com/facebook/react/issues/11488#issuecomment-1300987446
export const setReactInputValue = (
  input: HTMLInputElement & ReactInternalHack,
  value: string,
): void => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )?.set;
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(input, value);
  } else {
    throw new Error('Unable to find the native input value setter');
  }
  const inputEvent = new Event('input', { bubbles: true });
  const changeEvent = new Event('change', { bubbles: true });
  input.dispatchEvent(inputEvent);
  input.dispatchEvent(changeEvent);
};
