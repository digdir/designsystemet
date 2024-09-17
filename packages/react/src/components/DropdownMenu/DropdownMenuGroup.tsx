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
>(function DropdownMenuGroup(
  { children, heading, className, style, ...rest },
  ref,
) {
  const { size } = useContext(DropdownMenuCtx);
  const headingId = useId();

  return (
    <li className={className} style={style}>
      <ul
        {...(heading ? { 'aria-labelledby': headingId } : {})}
        ref={ref}
        role='group'
        className={'ds-dropdownmenu__group'}
        {...rest}
      >
        {heading && (
          <Paragraph asChild size={size}>
            <h2 id={headingId} className={'ds-dropdownmenu__heading'}>
              {heading}
            </h2>
          </Paragraph>
        )}
        {children}
      </ul>
    </li>
  );
});
