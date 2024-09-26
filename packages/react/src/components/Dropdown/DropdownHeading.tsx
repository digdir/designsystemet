import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef } from 'react';

export type DropdownHeadingProps = HTMLAttributes<HTMLHeadingElement>;

export const DropdownHeading = forwardRef<
  HTMLHeadingElement,
  DropdownHeadingProps
>(function DropdownHeading({ className, ...rest }, ref) {
  return (
    <h2 ref={ref} className={cl('ds-dropdown__heading', className)} {...rest} />
  );
});
