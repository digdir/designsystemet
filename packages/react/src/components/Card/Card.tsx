import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

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
  /** Instances of `Card.Section`, `Divider` or other React nodes */
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Card component to present content in a structured way.
 * @example
 * <Card>
 *  <Card.Section>Header</Card.Section>
 *  <Card.Section>Content</Card.Section>
 *  <Card.Section>Footer</Card.Section>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { asChild = false, color = 'neutral', className, ...rest },
  ref,
) {
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={cl(`ds-card`, className)}
      data-color={color}
      ref={ref}
      {...rest}
    />
  );
});
