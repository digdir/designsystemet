import cl from 'clsx';

import { capitalizeString } from '../../utils/StringHelpers';

import classes from './Tag.module.css';

interface TagProps {
  color: string;
  type: string;
  size?: 'small' | 'medium' | 'large';
}

const Tag = ({ color, type, size = 'medium' }: TagProps) => {
  return (
    <span className={cl(classes.tag, classes[color], classes[size])}>
      {capitalizeString(type)}
    </span>
  );
};

export { Tag };
