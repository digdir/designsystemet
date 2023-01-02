import React from 'react';
import cn from 'classnames';

import { IconVariant } from './utils';
import { ErrorIcon } from './ErrorIcon';
import { SearchIcon } from './SearchIcon';
import classes from './Icon.module.css';

export interface IconProps {
  variant?: IconVariant;
  disabled?: boolean;
}

export const Icon = ({ variant, disabled = false }: IconProps) => {
  switch (variant) {
    case IconVariant.Error:
      return (
        <div className={classes.icon} data-testid='input-icon-error'>
          <ErrorIcon />
        </div>
      );
    case IconVariant.Search:
      return (
        <div
          className={cn(classes.icon, disabled && classes.disabled)}
          data-testid='input-icon-search'
        >
          <SearchIcon />
        </div>
      );
    default:
      return null;
  }
};
