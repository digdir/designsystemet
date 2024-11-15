import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import type { Color } from 'packages/react/src/colors';
import type { DefaultProps } from 'packages/react/src/types';
import type { Merge } from 'packages/react/src/utilities';
import { Label } from '../../Label';
import { ValidationMessage } from '../../ValidationMessage';
import { Field } from '../Field';
import { Input, type InputProps } from '../Input';

export type CheckboxProps = Merge<
  DefaultProps & Omit<InputProps, 'type' | 'role' | 'size'>,
  {
    /** The color of the fill for checked and indeterminate checkboxes.
     * If left unspecified, the color is inherited from the nearest ancestor with data-color.
     */
    'data-color'?: Color;
    /** Optional aria-label */
    'aria-label'?: string;
    /** Checkbox label */
    label?: ReactNode;
    /** Description for field */
    description?: ReactNode;
    /** Value of the `input` element */
    value?: InputProps['value'];
    /** Validation message for field */
    validation?: ReactNode;
  } & (
    | { 'aria-label': string; 'aria-labelledby'?: never; label?: never }
    | { 'aria-label'?: never; 'aria-labelledby'?: never; label: ReactNode }
    | { 'aria-label'?: never; 'aria-labelledby': string; label?: never }
  )
>;

/**
 * Checkbox used to select multiple options.
 * @example
 * <Checkbox label="I agree" value="agree" />
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { 'data-size': size, children, label, description, validation, ...rest },
    ref,
  ) {
    return (
      <Field data-size={size}>
        <Input type='checkbox' ref={ref} {...rest} />
        {!!label && <Label weight='regular'>{label}</Label>}
        {!!description && <div data-field='description'>{description}</div>}
        {!!validation && <ValidationMessage>{validation}</ValidationMessage>}
      </Field>
    );
  },
);
