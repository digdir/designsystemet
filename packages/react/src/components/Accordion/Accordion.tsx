import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';

export type AccordionProps = {
  /** Accordion background color */
  color?: 'first' | 'second' | 'third' | 'neutral' | 'subtle';
  /** Show border */
  border?: boolean;
  /** Instances of `Accordion.Item` */
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ border = false, color = 'neutral', className, ...rest }, ref) => (
    <div
      className={cl('fds-accordion', border && 'fds-accordion--border', color && `fds-accordion--${color}`, className)}
      ref={ref}
      {...rest}
    />
  ),
);

Accordion.displayName = 'Accordion';
