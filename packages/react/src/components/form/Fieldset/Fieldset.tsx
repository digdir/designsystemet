import { PadlockLockedFillIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useContext } from 'react';

import { ErrorMessage, Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import { FieldsetContext } from './FieldsetContext';
import { useFieldset } from './useFieldset';

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
  (props, ref) => {
    const {
      children,
      legend,
      description,
      error,
      hideLegend,
      className,
      ...rest
    } = props;

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
          {...fieldsetProps}
          className={cl(
            'ds-fieldset',
            !hideLegend && 'ds-fieldset--spacing',
            readOnly && 'ds-fieldset--readonly',
            className,
          )}
          disabled={props?.disabled}
          ref={ref}
          {...rest}
        >
          <Label asChild size={size}>
            <legend className={'ds-fieldset__legend'}>
              <span
                className={cl(
                  'ds-fieldset__legend__content',
                  hideLegend && `ds-sr-only`,
                )}
              >
                {readOnly && (
                  <PadlockLockedFillIcon
                    className={'ds-fieldset__readonly__icon'}
                    aria-hidden
                  />
                )}
                {legend}
              </span>
            </legend>
          </Label>
          {description && (
            <Paragraph size={size} variant='short' asChild>
              <div
                id={descriptionId}
                className={cl(
                  'ds-fieldset__description',
                  'ds-font-weight--regular',
                  hideLegend && `ds-sr-only`,
                )}
              >
                {description}
              </div>
            </Paragraph>
          )}
          {children}
          <div
            id={errorId}
            aria-live='polite'
            aria-relevant='additions removals'
            className={'ds-fieldset__error-message'}
          >
            {hasError && <ErrorMessage size={size}>{error}</ErrorMessage>}
          </div>
        </fieldset>
      </FieldsetContext.Provider>
    );
  },
);

Fieldset.displayName = 'Fieldset';
