import React from 'react';
import cn from 'classnames';

import classes from './MdxContent.module.css';

interface MdxContentProps {
  children: React.ReactNode;
  classname?: string;
}

const MdxContent = ({ children, classname }: MdxContentProps) => {
  return <div className={cn(classname, classes.content)}>{children}</div>;
};

export { MdxContent };
