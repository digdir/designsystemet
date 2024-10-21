import cl from 'clsx/lite';
import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useContext } from 'react';

import { Label } from '../../Label';
import { Paragraph } from '../../Paragraph';
import { ValidationMessage } from '../../ValidationMessage';
import { type FormFieldProps, useFormField } from '../useFormField';

import { FieldsetContext } from './FieldsetContext';

export type FieldsetProps = {
  /** A description of the fieldset. This will appear below the legend. */
  description?: ReactNode;
  /** Toggle `disabled` all input fields within the fieldset. */
  disabled?: boolean;
  /** If set, this will diplay an error message at the bottom of the fieldset. */
  error?: ReactNode;
  /** The legend of the fieldset. */
  legend: ReactNode;
  /** Toggle `readOnly` on fieldset context.
   * @note This does not prevent fieldset values from being submited */
  readOnly?: boolean;
  /** Visually hide `legend` and `description` (still available for screen readers)  */
  hideLegend?: boolean;
} & Pick<FormFieldProps, 'size'> &
  FieldsetHTMLAttributes<HTMLFieldSetElement>;

export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  function Fieldset(props, ref) {
    const {
      children,
      legend,
      description,
      error,
      hideLegend,
      className,
      ...rest
    } = props;

    const fieldset = useContext(FieldsetContext);
    const { inputProps, size, readOnly, errorId, hasError, descriptionId } =
      useFormField(props, 'fieldset');

    return (
      <FieldsetContext.Provider
        value={{
          disabled: props?.disabled,
          error: error ?? fieldset?.error,
          errorId: hasError ? errorId : undefined,
          readOnly, // TODO should this be a prop on Fieldset?
          size,
        }}
      >
        <fieldset
          aria-describedby={inputProps['aria-describedby']}
          aria-invalid={inputProps['aria-invalid']}
          className={cl('ds-fieldset', className)}
          data-readonly={readOnly}
          data-hidelegend={hideLegend || undefined}
          disabled={props?.disabled}
          ref={ref}
          {...rest}
        >
          <Label asChild size={size}>
            <legend>{legend}</legend>
          </Label>
          {!!description && (
            <Paragraph id={descriptionId} size={size} variant='short'>
              {description}
            </Paragraph>
          )}
          {children}
          <div
            aria-live='polite'
            aria-relevant='additions removals'
            id={errorId}
          >
            {hasError && (
              <ValidationMessage size={size}>{error}</ValidationMessage>
            )}
          </div>
        </fieldset>
      </FieldsetContext.Provider>
    );
  },
);
