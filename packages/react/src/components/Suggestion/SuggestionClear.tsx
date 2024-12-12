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

export const SuggestionClear = forwardRef<
  HTMLButtonElement,
  SuggestionClearProps
>(function SuggestionClear(
  { 'aria-label': label = 'Tøm', onClick, ...rest },
  ref,
) {
  const { inputRef, listRef, handleValueChange } =
    useContext(SuggestionContext);

  const handleClear = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!inputRef?.current) throw new Error('Input is missing');
    /* narrow type to make TS happy */
    if (!(inputRef?.current instanceof HTMLInputElement))
      throw new Error('Input is not an input element');

    event.preventDefault();
    setReactInputValue(inputRef.current, '');
    handleValueChange?.('');
    /* Unselect selected option */
    const option = listRef?.current?.querySelector('[aria-selected="true"]');
    if (option) {
      option.setAttribute('aria-selected', 'false');
      option.removeAttribute('selected');
    }
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
