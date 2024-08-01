import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type AccordionRootProps = {
  /**
   * Accordion background color
   * @default neutral
   */
  color?: 'brand1' | 'brand2' | 'brand3' | 'neutral' | 'subtle';
  /**
   * Show border
   * @default false
   **/
  border?: boolean;
  /** Instances of `Accordion.Item` */
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

/**
 * Accordion root component, contains `Accordion.Item` components.
 */
export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>(
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

AccordionRoot.displayName = 'AccordionRoot';
