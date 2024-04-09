import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utilities';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import classes from './Switch.module.css';
import { useSwitch } from './useSwitch';

export type SwitchProps = {
  /** Switch label */
  children?: ReactNode;
  /** Value of the `input` element */
  value?: string;
  /** Position of switch around the label
   * @default left
   */
  position?: 'left' | 'right';
} & Omit<FormFieldProps, 'error' | 'errorId' | 'id'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (props, ref) => {
    const {
      children,
      description,
      position = 'left',
      className,
      ...rest
    } = props;
    const {
      inputProps,
      descriptionId,
      size = 'medium',
      readOnly,
    } = useSwitch(props);

    return (
      <Paragraph
        asChild
        size={size}
      >
        <div
          className={cl(
            classes.switch,
            classes[size],
            inputProps.disabled && classes.disabled,
            readOnly && classes.readonly,
            className,
          )}
        >
          <input
            className={classes.input}
            ref={ref}
            {...omit(['size', 'error'], rest)}
            {...inputProps}
          />

          <Label
            className={cl(classes.label, position === 'right' && classes.right)}
            htmlFor={inputProps.id}
            size={size}
            weight='regular'
          >
            <span className={classes.track}>
              <span className={classes.thumb} />
            </span>
            {readOnly && (
              <PadlockLockedFillIcon
                aria-hidden
                className={classes.padlock}
              />
            )}
            {children && <span>{children}</span>}
          </Label>
          {description && (
            <Paragraph
              asChild
              size={size}
            >
              <div
                id={descriptionId}
                className={classes.description}
              >
                {description}
              </div>
            </Paragraph>
          )}
        </div>
      </Paragraph>
    );
  },
);

Switch.displayName = 'Switch';
