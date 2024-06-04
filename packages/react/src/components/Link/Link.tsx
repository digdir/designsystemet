import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';
import { Slot } from '@radix-ui/react-slot';

export type LinkProps = {
  /** The content to display inside the link. */
  children: ReactNode;

  /** Custom class name for the link. This will be appended to the design system class names. */
  className?: string;

  /** The URL that the link points to. This can also be an email address (starting with `mailto:`) or a phone number (staring with `tel:`). */
  href?: string;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'a';

    return (
      <Component
        className={cl('fds-link', className)}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    );
  },
);

Link.displayName = 'Link';
