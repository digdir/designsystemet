import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import React, { useContext, forwardRef, createContext } from 'react';
import cn from 'classnames';

import { Label, Paragraph, ErrorMessage } from '../../Typography';

import classes from './Fieldset.module.css';

export type FieldsetContextType = {
  error?: ReactNode;
  errorId?: string;
  disabled?: boolean;
  readOnly?: boolean;
  size?: 'xsmall' | 'small' | 'medium';
};

export const FieldsetContext = createContext<FieldsetContextType | null>(null);

export type FieldsetProps = {
  /** A description of the field set. This will appear below the legend. */
  description?: ReactNode;
  /** Set to `true` to disable all input fields within the field set. */
  disabled?: boolean;
  /** If set, this will diplay an error message at the bottom of the component. */
  error?: ReactNode;
  /** The legend of the field set. */
  legend?: ReactNode;
  /** The size of the field set. */
  size?: 'xsmall' | 'small' | 'medium';
  /** */
  readOnly?: boolean;
} & FieldsetHTMLAttributes<HTMLFieldSetElement>;

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  (props, ref) => {
    const {
      children,
      legend,
      description,
      size,
      error,
      disabled,
      readOnly,
      ...rest
    } = props;

    const fieldset = useContext(FieldsetContext);

    return (
      <FieldsetContext.Provider
        value={{
          error: error ?? fieldset?.error,
          errorId: 'fds-error',
          size,
          disabled,
          readOnly,
        }}
      >
        <fieldset
          {...rest}
          className={cn(classes.fieldset, rest.className)}
          ref={ref}
        >
          <Label
            as='legend'
            size={size}
          >
            {legend}
          </Label>
          {description && (
            <Paragraph
              className={classes.description}
              size={size}
              as='div'
              short
            >
              {description}
            </Paragraph>
          )}
          {children}
          {error && <ErrorMessage size={size}>{error}</ErrorMessage>}
        </fieldset>
      </FieldsetContext.Provider>
    );
  },
);
