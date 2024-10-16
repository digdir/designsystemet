'use client';
import cl from 'clsx/lite';
import type * as React from 'react';

import classes from './MdxContent.module.css';

type MdxContentProps = React.HTMLAttributes<HTMLDivElement>;

const MdxContent = ({ className, ...rest }: MdxContentProps) => {
  return <div className={cl(classes.content, className)} {...rest} />;
};

export { MdxContent };
