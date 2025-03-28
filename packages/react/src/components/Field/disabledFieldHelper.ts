import type { HTMLProps } from 'react';

export const disabledFieldHelper = (
  props: Pick<HTMLProps<HTMLInputElement>, 'disabled' | 'aria-disabled'>,
) => (props.disabled || props['aria-disabled']) && { 'aria-disabled': true };
