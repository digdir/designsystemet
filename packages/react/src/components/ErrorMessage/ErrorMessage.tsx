import React from 'react';

import classes from './ErrorMessage.module.css';

export interface ErrorMessageProps {
  id?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}

const ErrorMessage = ({ id, children, ariaLabel }: ErrorMessageProps) => {
  return (
    <div
      aria-label={ariaLabel}
      className={classes.errorMessageWrapper}
      data-testid='ErrorMessage'
      id={id}
      role='alertdialog'
    >
      {children}
    </div>
  );
};

ErrorMessage.displayName = 'ErrorMessage';

export { ErrorMessage };
