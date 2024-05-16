import type * as React from 'react';
import cl from 'clsx';

import classes from './MdxContent.module.css';

interface MdxContentProps {
  children: React.ReactNode;
  classname?: string;
}

const MdxContent = ({ children, classname }: MdxContentProps) => {
  return <div className={cl(classname, classes.content)}>{children}</div>;
};

export { MdxContent };
