import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef, useEffect, useId, useRef } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { useMergeRefs } from '../../utilities/hooks';

export type CardProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Change the background color of the card.
     *
     * @default 'default'
     */
    variant?: 'default' | 'tinted';
    /**
     * Change the default rendered element for the one passed as a child, merging their props and behavior.
     * @default false
     */
    asChild?: boolean;
    /** Instances of `Card.Block`, `Divider` or other React nodes */
    children: ReactNode;
  }
>;

const ATTR_CLICKDELEGATE = 'data-clickdelegatefor';
const SELECTOR_LINK = `:is(h1,h2,h3,h4,h5,h6) a`;
const SELECTOR_SKIP =
  'a,button,label,details,dialog,[role="button"],[popover],[contenteditable]';

/**
 * Card component to present content in a structured way.
 *
 * @example
 * <Card>
 *  <Card.Block>Header</Card.Block>
 *  <Card.Block>Content</Card.Block>
 *  <Card.Block>Footer</Card.Block>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { asChild = false, variant = 'default', className, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'div';
  const cardRef = useRef<HTMLDivElement>(null);
  const linkGeneratedId = useId();
  const mergedRefs = useMergeRefs([cardRef, ref]);

  // Forward click on card to heading links for better accessibility
  // https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html
  useEffect(() => {
    const card = cardRef.current;
    const link = card?.querySelector(SELECTOR_LINK);
    const skip = !link || link.parentElement?.closest(SELECTOR_SKIP); // Using parentElement as link variable will always match a selector
    const id = link?.id;

    if (card?.hasAttribute(ATTR_CLICKDELEGATE) || skip) return; // Already delegated or skipped
    link.id = id || linkGeneratedId;
    card?.setAttribute(ATTR_CLICKDELEGATE, link.id);

    return () => {
      if (id && link) link.id = id;
      else link?.removeAttribute('id');
      card?.removeAttribute(ATTR_CLICKDELEGATE);
    };
  }, []);

  return (
    <Component
      className={cl(`ds-card`, className)}
      data-variant={variant}
      ref={mergedRefs}
      {...rest}
    />
  );
});
