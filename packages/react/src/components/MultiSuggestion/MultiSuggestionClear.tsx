import { forwardRef } from 'react';
import { Button, type ButtonProps } from '../Button';

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
  return (
    <Button
      aria-label={label}
      asChild
      icon
      ref={ref}
      variant='tertiary'
      {...rest}
    >
      <del />
    </Button>
  );
});
