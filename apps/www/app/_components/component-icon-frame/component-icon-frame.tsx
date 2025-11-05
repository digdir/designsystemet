import cl from 'clsx/lite';
import type { HTMLAttributes, ReactNode } from 'react';
import classes from './component-icon-frame.module.css';

type IconFrameProps = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const IconFrame = ({ children, className, ...props }: IconFrameProps) => {
  return (
    <div
      className={cl(classes.iconFrame, 'icon-frame', className)}
      aria-hidden='true'
      {...props}
    >
      <div className={classes.decorator}></div>
      <div className={classes.decorator}></div>
      {children}
    </div>
  );
};

export { IconFrame };
