import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef, useContext } from 'react';
import { Paragraph } from '../Typography';
import { DropdownCtx } from './Dropdown';

export type DropdownHeadingProps = HTMLAttributes<HTMLHeadingElement>;

export const DropdownHeading = forwardRef<
  HTMLHeadingElement,
  DropdownHeadingProps
>(function DropdownHeading({ children, className, ...rest }, ref) {
  const { size } = useContext(DropdownCtx);

  return (
    <Paragraph asChild size={size}>
      <h2 ref={ref} className={cl('ds-dropdown__heading', className)} {...rest}>
        {children}
      </h2>
    </Paragraph>
  );
});
