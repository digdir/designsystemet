import React from 'react';
import cn from 'classnames';

import { ErrorMessage } from '../';

import classes from './FieldSet.module.css';

export interface FieldSetProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  description?: string;
  disabled?: boolean;
  error?: React.ReactNode;
  legend?: string;
  size?: FieldSetSize;
}

export enum FieldSetSize {
  Xsmall = 'xsmall',
  Small = 'small',
}

export const FieldSet = ({
  children,
  className,
  contentClassName,
  description,
  disabled,
  error,
  legend,
  size = FieldSetSize.Small,
}: FieldSetProps) => {
  return (
    <fieldset
      className={cn(classes.fieldSet, classes[size], className)}
      disabled={disabled}
    >
      {legend && <legend className={classes.legend}>{legend}</legend>}
      {description && <p className={classes.description}>{description}</p>}
      <div className={cn(classes.content, contentClassName)}>{children}</div>
      {error && (
        <div className={classes.errorMessage}>
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}
    </fieldset>
  );
};
