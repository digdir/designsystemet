import cl from 'clsx';

import type { IconVariant_ } from './utils';
import { ErrorIcon } from './ErrorIcon';
import { SearchIcon } from './SearchIcon';
import classes from './Icon.module.css';

export interface IconProps {
  variant?: IconVariant_;
  disabled?: boolean;
}

export const Icon = ({ variant, disabled = false }: IconProps) => {
  switch (variant) {
    case 'error':
      return (
        <span
          className={classes.icon}
          data-testid='input-icon-error'
        >
          <ErrorIcon />
        </span>
      );
    case 'search':
      return (
        <span
          className={cl(classes.icon, disabled && classes.disabled)}
          data-testid='input-icon-search'
        >
          <SearchIcon />
        </span>
      );
    default:
      return null;
  }
};
