import type { FieldsetHTMLAttributes, ForwardedRef, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { ErrorMessage, HelpText } from '../..';

import classes from './FieldSet.module.css';

export type FieldSetProps = {
  /** Class name that is applied to the content within the field set. */
  contentClassName?: string;

  /** A description of the field set. This will appear below the legend. */
  description?: ReactNode;

  /** Set to `true` to disable all input fields within the field set. */
  disabled?: boolean;

  /** If set, this will diplay an error message at the bottom of the component. */
  error?: ReactNode;

  /**
   * If set, a help text button will appear next to the legend.
   * The provided message will appear when the user clicks on the button.
   */
  helpText?: ReactNode;

  /** The title of the help text button. */
  helpTextTitle?: string;

  /** The legend of the field set. */
  legend?: ReactNode;

  /** The size of the field set. */
  size?: 'xsmall' | 'small';
} & FieldsetHTMLAttributes<HTMLFieldSetElement>;

/**
 *
 * @deprecated
 * Will be replaced by new Fieldset component.
 */
const FieldSet = forwardRef<HTMLFieldSetElement, FieldSetProps>(
  (
    {
      children,
      className,
      contentClassName,
      description,
      disabled = false,
      error,
      helpText,
      helpTextTitle = 'Vis hjelpetekst',
      legend,
      size = 'small',
      ...rest
    },
    ref: ForwardedRef<HTMLFieldSetElement>,
  ) => (
    <fieldset
      ref={ref}
      disabled={disabled}
      {...rest}
      className={cn(classes.fieldSet, classes[size], className)}
    >
      {legend && (
        <legend className={classes.legend}>
          <span className={classes.legendAndHelpText}>
            <span className={classes.legendContent}>{legend}</span>
            {helpText && (
              <HelpText
                size={size}
                title={helpTextTitle}
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
          <ErrorMessage role='alert'>{error}</ErrorMessage>
        </div>
      )}
    </fieldset>
  ),
);

FieldSet.displayName = 'FieldSet';

export { FieldSet };
