'use client';
import cl from 'clsx/lite';
import type * as React from 'react';

import classes from './MdxContent.module.css';

interface MdxContentProps {
  children: React.ReactNode;
  classname?: string;
}

const MdxContent = ({ children, classname }: MdxContentProps) => {
  return <div className={cl(classname, classes.content)}>{children}</div>;
};

export { MdxContent };
