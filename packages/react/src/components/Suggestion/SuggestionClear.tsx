import { syncDatalistState } from '@u-elements/u-datalist';
import { forwardRef, useContext } from 'react';
import { Button, type ButtonProps } from '../Button';
import { SuggestionContext } from './Suggestion';

/* We omit children since we render the icon with css */
export type SuggestionClearProps = Omit<ButtonProps, 'variant' | 'children'> & {
  /**
   * Aria label for the clear button
   * @default 'Tøm'
   */
  'aria-label'?: string;
};

/**
 * Component that provides a clear button for the suggestion input.
 *
 * Place as a descendant of `Suggestion`
 *
 * @example
 * <Suggestion>
 *   <Suggestion.Input />
 *   <Suggestion.Clear />
 *   <Suggestion.List />
 * </Suggestion>
 */
export const SuggestionClear = forwardRef<
  HTMLButtonElement,
  SuggestionClearProps
>(function SuggestionClear(
  { 'aria-label': label = 'Tøm', onClick, ...rest },
  ref,
) {
  const { datalistRef, inputRef } = useContext(SuggestionContext); //, handleValueChange

  const handleClear = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!inputRef?.current) throw new Error('Input is missing');
    /* narrow type to make TS happy */
    if (!(inputRef?.current instanceof HTMLInputElement))
      throw new Error('Input is not an input element');

    if (!datalistRef?.current) throw new Error('Datalist is missing');

    event.preventDefault();
    setReactInputValue(inputRef.current, '');

    /* Unselect selected option */
    const options = datalistRef.current?.options;
    for (const option of options || []) {
      option.selected = false;
    }

    syncDatalistState(inputRef.current);

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
