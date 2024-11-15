import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import type { Color } from '../../../colors';
import type { DefaultProps } from '../../../types';
import type { Merge } from '../../../utilities';
import { Label } from '../../Label';
import { Field, type FieldProps } from '../Field';
import { Input, type InputProps } from '../Input';

export type SwitchProps = Merge<
  DefaultProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
  {
    /** Optional aria-label */
    'aria-label'?: string;
    /** Radio label */
    label?: ReactNode;
    /** Description for field */
    description?: ReactNode;
    /** Value of the `input` element */
    value?: InputProps['value'];
    /** Position of switch
     * @default start
     */
    position?: FieldProps['position'];
    /**
     * Changes field size and paddings
     */
    'data-size'?: 'sm' | 'md' | 'lg';
    /**
     * Specify which color palette to use. If left unspecified, the color is inherited
     * from the nearest ancestor with data-color.
     */
    'data-color'?: Color;
  } & (
    | { 'aria-label': string; 'aria-labelledby'?: never; label?: never }
    | { 'aria-label'?: never; 'aria-labelledby'?: never; label: ReactNode }
    | { 'aria-label'?: never; 'aria-labelledby': string; label?: never }
  )
>;

/**
 * Switch used to toggle options.
 * @example
 * <Switch label="I agree" value="agree" />
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    'data-size': size,
    children,
    className,
    description,
    label,
    position,
    style,
    ...rest
  },
  ref,
) {
  return (
    <Field
      className={className}
      data-position={position}
      data-size={size}
      style={style}
    >
      <Input type='checkbox' role='switch' ref={ref} {...rest} />
      {!!label && <Label weight='regular'>{label}</Label>}
      {!!description && <div data-field='description'>{description}</div>}
    </Field>
  );
});
