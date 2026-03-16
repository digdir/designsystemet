import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import type { DefaultProps, LabelRequired } from '../../types';
import type { MergeRight } from '../../utilities';
import { Field, type FieldProps } from '../field';
import { Input, type InputProps } from '../input/input';
import { Label } from '../label/label';

export type SwitchProps = MergeRight<
  DefaultProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
  {
    /**
     * Optional aria-label
     */
    'aria-label'?: string;
    /**
     * Switch label
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
    /**
     * If true, the switch will be displayed as a tile
     */
    'data-selection-tile'?: boolean;
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
    'data-selection-tile': tile,
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
      data-selection-tile={tile}
      style={style}
    >
      <Input type='checkbox' role='switch' ref={ref} {...rest} />
      {!!label && <Label weight='regular'>{label}</Label>}
      {!!description && <div data-field='description'>{description}</div>}
    </Field>
  );
});
