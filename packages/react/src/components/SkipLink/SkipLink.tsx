import cl from 'clsx/lite';
import { type AnchorHTMLAttributes, type ReactNode, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { Merge } from '../../utilities';

export type SkipLinkProps = Merge<
  DefaultProps & AnchorHTMLAttributes<HTMLAnchorElement>,
  {
    /** The content to display inside the skiplink. */
    children: ReactNode;

    /** Href of an element in the DOM the skiplink should skip to. E.g #main-content */
    href: string;
  }
>;

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  function SkipLink({ children, className, ...rest }, ref) {
    return (
      <a className={cl('ds-skiplink', className)} {...rest} ref={ref}>
        {children}
      </a>
    );
  },
);
