import React, { useCallback, useState } from 'react';
import cn from 'classnames';

import classes from './AnimateHeight.module.css';

export type AnimateHeightProps = {
  open: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * AnimateHeight is a component that animates its height when the `open` prop changes.
 */
export const AnimateHeight = ({
  children,
  className,
  open,
  style,
  ...rest
}: AnimateHeightProps) => {
  const [height, setHeight] = useState<number>(0);
  const contentRef = useCallback(
    (node: HTMLDivElement) => {
      open && node !== null && setHeight(node.getBoundingClientRect().height);
    },
    [open],
  );

  const stateClass = open ? classes.open : classes.closed;

  return (
    <div
      {...rest}
      className={cn(classes.root, className)}
      style={{ height: open ? height : 0, ...style }}
    >
      <div
        ref={contentRef}
        className={classes.content + ' ' + stateClass}
      >
        {children}
      </div>
    </div>
  );
};
