import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef, useEffect, useRef } from 'react';

export type CardProps = {
  /**
   * Changes background & border color
   * @default neutral
   */
  color?: 'neutral' | 'subtle' | 'brand1' | 'brand2' | 'brand3';
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   * @default false
   */
  asChild?: boolean;
  /** Instances of `Card.Part`, `Divider` or other React nodes */
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Card component to present content in a structured way.
 * @example
 * <Card>
 *  <Card.Part>Header</Card.Part>
 *  <Card.Part>Content</Card.Part>
 *  <Card.Part>Footer</Card.Part>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { asChild = false, color = 'neutral', className, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'div';
  const cardRef = useRef<HTMLDivElement>(null);
  const mergedRefs = useMergeRefs([cardRef, ref]);

  // Forward click on card to heading links for better accessibility
  // https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html
  useEffect(() => {
    const card = cardRef.current;
    const handleClick = ({ ctrlKey, metaKey, target }: MouseEvent) => {
      const link = card?.querySelector<HTMLAnchorElement>(
        ':is(h1,h2,h3,h4,h5,h6) a',
      );

      if (!link || link?.contains(target as Node)) return; // Let links handle their own clicks
      if (ctrlKey || metaKey) window.open(link.href, '', 'noreferrer');
      else link.click(); // Using link.click instead of window.location.href as this will trigger the browser's handling of rel=, target=, etc.
    };

    card?.addEventListener('click', handleClick);
    return () => card?.removeEventListener('click', handleClick);
  }, []);

  return (
    <Component
      className={cl(`ds-card`, className)}
      data-color={color}
      ref={mergedRefs}
      {...rest}
    />
  );
});
