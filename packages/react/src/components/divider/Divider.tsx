import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type DividerProps = HTMLAttributes<HTMLHRElement>;

/**
 * Divider component, used to separate content. Uses `hr` element.
 *
 * @example
 * <Divider />
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { className, ...rest },
  ref,
) {
  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: <hr> is not foucsable but biome thinks it is
    <hr
      aria-hidden='true'
      className={cl('ds-divider', className)}
      ref={ref}
      {...rest}
    />
  );
});
