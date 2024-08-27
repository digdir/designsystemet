import cl from 'clsx/lite';
import { forwardRef } from 'react';

export type DividerProps = {
  /**
   * The variant of the divider.
   * @default 'default'
   */
  variant?: 'default' | 'strong' | 'subtle';
} & React.HTMLAttributes<HTMLHRElement>;

export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { variant = 'default', className, ...rest },
  ref,
) {
  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: <hr> is not foucsable but biome thinks it is
    <hr
      aria-hidden='true'
      className={cl('ds-divider', className)}
      data-ds-variant={variant}
      ref={ref}
      {...rest}
    />
  );
});
