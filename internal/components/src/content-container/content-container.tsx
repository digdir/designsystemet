import { Slot } from '@radix-ui/react-slot';
import cl from 'clsx/lite';
import type { HTMLAttributes } from 'react';
import classes from './content-container.module.css';

export type ContentContainerProps = {
  /**
   * In pixels
   *
   * @default 1380
   */
  maxWidth?: number;
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ContentContainer = ({
  className,
  asChild = false,
  maxWidth = 1380,
  ...rest
}: ContentContainerProps) => {
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={cl(classes.container, className)}
      style={{ maxWidth: `${maxWidth}px` }}
      {...rest}
    />
  );
};
