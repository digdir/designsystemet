import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Label, Paragraph, ErrorMessage } from '../../Typography';

import classes from './Fieldset.module.css';

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
  size?: 'xsmall' | 'small';
} & FieldsetHTMLAttributes<HTMLFieldSetElement>;

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  ({ children, legend, description, size, error, ...rest }, ref) => {
    return (
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
            size={size}
            as='div'
            short
          >
            {description}
          </Paragraph>
        )}
        {children}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </fieldset>
    );
  },
);
