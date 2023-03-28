import React from 'react';
import cn from 'classnames';

import type { IconVariant_ } from './utils';
import { ErrorIcon } from './ErrorIcon';
import { SearchIcon } from './SearchIcon';
import classes from './Icon.module.css';

export interface IconProps {
  variant?: IconVariant_;
  disabled?: boolean;
  height: number;
}

export const Icon = ({ variant, disabled = false, height }: IconProps) => {
  switch (variant) {
    case 'error':
      return (
        <span
          className={classes.icon}
          data-testid='input-icon-error'
          style={{ height }}
        >
          <ErrorIcon />
        </span>
      );
    case 'search':
      return (
        <span
          className={cn(classes.icon, disabled && classes.disabled)}
          data-testid='input-icon-search'
          style={{ height }}
        >
          <SearchIcon />
        </span>
      );
    default:
      return null;
  }
};
