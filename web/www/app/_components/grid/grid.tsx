import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import classes from './grid.module.css';

export type GridProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Grid = ({ children, className, ...props }: GridProps) => {
  return (
    <div className={cl(classes.grid, className)} {...props}>
      {children}
    </div>
  );
};

export { Grid };
