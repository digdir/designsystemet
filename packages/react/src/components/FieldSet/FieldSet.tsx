import type { ReactNode } from 'react';
import React from 'react';
import cn from 'classnames';

import { ErrorMessage, HelpText } from '../';

import classes from './FieldSet.module.css';

export interface FieldSetProps
  extends React.DetailedHTMLProps<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    HTMLFieldSetElement
  > {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  legend?: ReactNode;
  size?: 'xsmall' | 'small';
}

const FieldSet = ({
  children,
  className,
  contentClassName,
  description,
  disabled,
  error,
  helpText,
  legend,
  size = 'small',
  ...rest
}: FieldSetProps) => {
  return (
    <fieldset
      className={cn(classes.fieldSet, classes[size], className)}
      disabled={disabled}
      {...rest}
    >
      {legend && (
        <legend className={classes.legend}>
          <span className={classes.legendAndHelpText}>
            <span className={classes.legendContent}>{legend}</span>
            {helpText && (
              <HelpText
                size={size}
                title={
                  typeof legend === 'string' ? `Help text for ${legend}` : ''
                }
              >
                {helpText}
              </HelpText>
            )}
          </span>
        </legend>
      )}
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

FieldSet.displayName = 'FieldSet';

export { FieldSet };
