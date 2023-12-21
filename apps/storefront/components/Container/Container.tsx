import React from 'react';
import cl from 'clsx';

import classes from './Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
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
