import type { ReactNode, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx/lite';

export type AccordionProps = {
  /** Accordion background color
   * @default neutral
   */
  color?: 'brand1' | 'brand2' | 'brand3' | 'neutral' | 'subtle';
  /** Show border */
  border?: boolean;
  /** Instances of `Accordion.Item` */
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ border = false, color = 'neutral', className, ...rest }, ref) => {
    return (
      <div
        className={cl(
          'ds-accordion',
          border && 'ds-accordion--border',
          color && `ds-accordion--${color}`,
          className,
        )}
        ref={ref}
        {...rest}
      />
    );
  },
);

Accordion.displayName = 'Accordion';
