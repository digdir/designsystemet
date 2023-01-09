import React, { ReactNode } from 'react';
import cn from 'classnames';

import { ErrorMessage } from '../';

import classes from './FieldSet.module.css';

export interface FieldSetProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
  legend?: ReactNode;
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
}: FieldSetProps) => (
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
