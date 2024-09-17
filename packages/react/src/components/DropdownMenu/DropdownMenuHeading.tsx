import cl from 'clsx/lite';
import { type HTMLAttributes, forwardRef, useContext } from 'react';
import { Paragraph } from '../Typography';
import { DropdownMenuCtx } from './DropdownMenu';

export type DropdownMenuHeadingProps = HTMLAttributes<HTMLHeadingElement>;

export const DropdownMenuHeading = forwardRef<
  HTMLHeadingElement,
  DropdownMenuHeadingProps
>(function DropdownMenuHeading({ children, className, ...rest }, ref) {
  const { size } = useContext(DropdownMenuCtx);

  return (
    <Paragraph asChild size={size}>
      <h2
        ref={ref}
        className={cl('ds-dropdownmenu__heading', className)}
        {...rest}
      >
        {children}
      </h2>
    </Paragraph>
  );
});
