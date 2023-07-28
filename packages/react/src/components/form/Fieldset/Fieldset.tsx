import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import React, { useContext, forwardRef, createContext } from 'react';
import cn from 'classnames';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { Label, Paragraph, ErrorMessage } from '../../Typography';

import { useFieldset } from './useFieldset';
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
  /** A description of the fieldset. This will appear below the legend. */
  description?: ReactNode;
  /** Toggle `disabled` all input fields within the fieldset. */
  disabled?: boolean;
  /** If set, this will diplay an error message at the bottom of the fieldset. */
  error?: ReactNode;
  /** The legend of the fieldset. */
  legend?: ReactNode;
  /** The size of the fieldset. */
  size?: 'xsmall' | 'small' | 'medium';
  /** Toggle `readOnly` on fieldset context.
   * @note This does not prevent fieldset values from being submited */
  readOnly?: boolean;
} & FieldsetHTMLAttributes<HTMLFieldSetElement>;

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  (props, ref) => {
    const { children, legend, description, error, ...rest } = props;

    const { fieldsetProps, size, readOnly, errorId, hasError, descriptionId } =
      useFieldset(props);

    const fieldset = useContext(FieldsetContext);

    return (
      <FieldsetContext.Provider
        value={{
          error: error ?? fieldset?.error,
          errorId: hasError ? errorId : undefined,
          size,
          disabled: props?.disabled,
          readOnly,
        }}
      >
        <fieldset
          {...rest}
          {...fieldsetProps}
          className={cn(
            classes.fieldset,
            readOnly && classes.readonly,
            props?.disabled && classes.disabled,
            rest.className,
          )}
          ref={ref}
        >
          <Label
            as='legend'
            size={size}
            className={classes.legend}
          >
            {readOnly && <PadlockLockedFillIcon />}
            {legend}
          </Label>
          {description && (
            <Paragraph
              id={descriptionId}
              className={classes.description}
              size={size}
              as='div'
              short
            >
              {description}
            </Paragraph>
          )}
          {children}
          <div
            id={errorId}
            aria-live='polite'
            aria-relevant='additions removals'
          >
            {hasError && <ErrorMessage size={size}>{error}</ErrorMessage>}
          </div>
        </fieldset>
      </FieldsetContext.Provider>
    );
  },
);
