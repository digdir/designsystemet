import cl from 'clsx/lite';
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';

export type SkipLinkProps = {
  /** The content to display inside the skiplink. */
  children: ReactNode;

  /** Href of an element in the DOM the skiplink should skip to. E.g #main-content */
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  function SkipLink({children,
    className,
    ...rest
  }) {
  return (
    <a className={cl('ds-skiplink', className)} {...rest}>
      {children}
    </a>
  );
})
