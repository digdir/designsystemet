import { forwardRef } from 'react';
import type * as React from 'react';
import cl from 'clsx/lite';

type ComboboxOptionDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export const ComboboxOptionDescription = forwardRef<
  HTMLSpanElement,
  ComboboxOptionDescriptionProps
>(({ children, className, ...rest }, ref) => {
  return (
    <span
      className={cl('fds-combobox__option__description', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </span>
  );
});

ComboboxOptionDescription.displayName = 'ComboboxOptionDescription';

export default ComboboxOptionDescription;
