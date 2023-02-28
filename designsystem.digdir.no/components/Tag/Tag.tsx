import React from 'react';
import cn from 'classnames';

import { capitalizeString } from '../../utils/StringHelpers';

import classes from './Tag.module.css';

interface TagProps {
  color: string;
  type: string;
  size?: 'small' | 'medium' | 'large';
}

const Tag = ({ color, type, size = 'medium' }: TagProps) => {
  return (
    <span className={cn(classes.tag, classes[color], classes[size])}>
      {capitalizeString(type)}
    </span>
  );
};

export { Tag };
