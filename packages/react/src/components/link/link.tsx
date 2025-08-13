import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Children, forwardRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';

export type LinkProps = MergeRight<
  DefaultProps & AnchorHTMLAttributes<HTMLAnchorElement>,
  {
    /**
     * The content to display inside the link.
     **/
    children: ReactNode;
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
  }
>;

/**
 * Link component, renders a native `a` element.
 *
 * @example
 * <Link href='#'>Link</Link>
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ asChild, className, children, ...rest }, ref) => {
    const Component = asChild ? Slot : 'a';
    // Ensure bare strings are wrapped in <span> if there are 2 or more children.
    // This is necessary for styling which removes underline between icon and text.
    const fixedChildren =
      Children.count(children) > 1
        ? Children.map(children, (child) =>
            typeof child === 'string' ? <span>{child.trim()}</span> : child,
          )
        : children;
    return (
      <Component className={cl('ds-link', className)} ref={ref} {...rest}>
        {fixedChildren}
      </Component>
    );
  },
);

Link.displayName = 'Link';
