import type { ReactNode } from 'react';
import cl from 'clsx';

import classes from './Container.module.css';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div
      {...props}
      className={cl(className, classes.container)}
    >
      {children}
    </div>
  );
};

export { Container };
