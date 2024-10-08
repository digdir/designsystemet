import cl from 'clsx/lite';
import { type AnchorHTMLAttributes, type ReactNode, forwardRef } from 'react';

export type SkipLinkProps = {
  /** The content to display inside the skiplink. */
  children: ReactNode;

  /** Href of an element in the DOM the skiplink should skip to. E.g #main-content */
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  function SkipLink({ children, className, ...rest }, ref) {
    return (
      <a className={cl('ds-skiplink', className)} {...rest} ref={ref}>
        {children}
      </a>
    );
  },
);
