import type { ReactNode } from 'react';
import React from 'react';
import cn from 'classnames';

import { ErrorMessage, HelpText } from '../';
import { HelpTextSize } from '../HelpText/HelpText';

import classes from './FieldSet.module.css';

export interface FieldSetProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  legend?: ReactNode;
  size?: FieldSetSize;
}

export enum FieldSetSize {
  Xsmall = 'xsmall',
  Small = 'small',
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
  size = FieldSetSize.Small,
}: FieldSetProps) => {
  const helpTextSize =
    size === FieldSetSize.Xsmall ? HelpTextSize.Xsmall : HelpTextSize.Small;
  return (
    <fieldset
      className={cn(classes.fieldSet, classes[size], className)}
      disabled={disabled}
    >
      {legend && (
        <legend className={classes.legend}>
          <span className={classes.legendAndHelpText}>
            <span className={classes.legendContent}>{legend}</span>
            {helpText && (
              <HelpText
                size={helpTextSize}
                title={`Help text for ${legend}`}
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
