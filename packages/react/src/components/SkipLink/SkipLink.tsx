import cl from 'clsx/lite';
import { type AnchorHTMLAttributes, type ReactNode, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type SkipLinkProps = MergeRight<
  DefaultProps & AnchorHTMLAttributes<HTMLAnchorElement>,
  {
    /**
     * The content to display inside the skiplink.
     */
    children: ReactNode;
    /**
     * Href of an element in the DOM the skiplink should skip to. E.g #main-content
     */
    href: string;
  }
>;

/**
 * SkipLink component, used to display a skip link within the page.
 * Place it at the top of the page to allow users to skip to the main content.
 *
 * @example
 * <SkipLink href='#main-content'>Skip to main content</SkipLink>
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  function SkipLink({ children, className, ...rest }, ref) {
    return (
      <a className={cl('ds-skiplink', className)} {...rest} ref={ref}>
        {children}
      </a>
    );
  },
);
