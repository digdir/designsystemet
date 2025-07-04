import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps, LabelRequired } from '../../types';
import type { MergeRight } from '../../utilities';
import { Field, type FieldProps } from '../Field';
import { Input, type InputProps } from '../Input';
import { Label } from '../Label';

export type SwitchProps = MergeRight<
  DefaultProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
  {
    /**
     * Optional aria-label
     */
    'aria-label'?: string;
    /**
     * Radio label
     */
    label?: ReactNode;
    /**
     * Description for field
     */
    description?: ReactNode;
    /**
     * Value of the `input` element
     */
    value?: InputProps['value'];
    /**
     * Position of switch
     * @default start
     */
    position?: FieldProps['position'];
  } & LabelRequired
>;

/**
 * Switch used to toggle options.
 *
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
