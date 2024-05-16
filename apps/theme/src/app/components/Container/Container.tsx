import cn from 'classnames';

import classes from './Container.module.css';

type ContainerProps = {
  children: React.ReactNode;
  className: string;
};

export const Container = ({ children, className }: ContainerProps) => {
  return <div className={cn(classes.container, className)}>{children}</div>;
};
