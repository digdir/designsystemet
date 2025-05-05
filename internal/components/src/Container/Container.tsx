import cl from 'clsx/lite';

import classes from './Container.module.css';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export const Container = ({ children, className, id }: ContainerProps) => {
  return (
    <div id={id} className={cl(classes.container, className)}>
      {children}
    </div>
  );
};
