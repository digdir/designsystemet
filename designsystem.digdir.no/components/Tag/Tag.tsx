import React from 'react';
import cn from 'classnames';

import classes from './Tag.module.css';

interface TagProps {
  color: string;
  type: string;
}

const Tag = ({ color, type }: TagProps) => {
  return <span className={cn(classes.tag, classes[color])}>{type}</span>;
};

export { Tag };
