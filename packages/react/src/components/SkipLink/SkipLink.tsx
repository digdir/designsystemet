import type { AnchorHTMLAttributes, ReactNode } from 'react';
import cl from 'clsx/lite';

export type SkipLinkProps = {
  /** The content to display inside the skiplink. */
  children: ReactNode;

  /** Href of an element in the DOM the skiplink should skip to. E.g #main-content */
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const SkipLink = ({
  href,
  children,
  className,
  ...rest
}: SkipLinkProps): JSX.Element => {
  return (
    <a
      href={href}
      className={cl(`ds-sr-only`, 'ds-skiplink', className)}
      {...rest}
    >
      <p className='ds-skiplink__content'>{children}</p>
    </a>
  );
};

SkipLink.displayName = 'SkipLink';
