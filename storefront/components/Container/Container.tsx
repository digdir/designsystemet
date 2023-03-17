import React from 'react';
import cn from 'classnames';

import classes from './Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className, ...restOfProps }: ContainerProps) => {
  return (
    <div
      className={cn(className, classes.container)}
      {...restOfProps}
    >
      {children}
    </div>
  );
};

export { Container };
