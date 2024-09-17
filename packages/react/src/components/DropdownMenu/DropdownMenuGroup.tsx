import cl from 'clsx/lite';
import { forwardRef, useContext, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

import { Paragraph } from '../Typography';

import { DropdownMenuCtx } from './DropdownMenuContext';

export type DropdownMenuGroupProps = {
  /**
   * Heading of the group
   */
  heading?: ReactNode;
} & HTMLAttributes<HTMLUListElement>;

export const DropdownMenuGroup = forwardRef<
  HTMLUListElement,
  DropdownMenuGroupProps
>(function DropdownMenuGroup({ children, heading, className, ...rest }, ref) {
  const { size } = useContext(DropdownMenuCtx);
  const headingId = useId();

  return (
    <>
      {heading && (
        <Paragraph asChild size={size}>
          <h2 id={headingId} className={'ds-dropdownmenu__heading'}>
            {heading}
          </h2>
        </Paragraph>
      )}
      <ul
        {...(heading ? { 'aria-labelledby': headingId } : {})}
        ref={ref}
        role='group'
        className={cl('ds-dropdownmenu__group', className)}
        {...rest}
      >
        {children}
      </ul>
    </>
  );
});
