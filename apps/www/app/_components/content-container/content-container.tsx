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
} & HTMLAttributes<HTMLDivElement>;

export const ContentContainer = ({
  className,
  maxWidth = 1380,
  ...rest
}: ContentContainerProps) => {
  return (
    <div
      className={cl(classes.container, className)}
      style={{ maxWidth: `${maxWidth}px` }}
      {...rest}
    />
  );
};
