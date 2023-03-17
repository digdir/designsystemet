import React from 'react';
import cn from 'classnames';

import classes from './Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div
      {...props}
      className={cn(className, classes.container)}
    >
      {children}
    </div>
  );
};

export { Container };
