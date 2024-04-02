import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import cl from 'clsx';

import { omit } from '../../../utilities';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import classes from './Radio.module.css';
import { useRadio } from './useRadio';

export type RadioProps = {
  /** Radio label */
  children?: ReactNode;
  /** Value of the `input` element */
  value: string;
} & Omit<FormFieldProps, 'error' | 'errorId'> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const { children, description, className, style, ...rest } = props;
  const {
    inputProps,
    descriptionId,
    hasError,
    size = 'medium',
    readOnly,
  } = useRadio(props);

  return (
    <Paragraph
      asChild
      size={size}
    >
      <div
        className={cl(
          classes.container,
          classes[size],
          inputProps.disabled && classes.disabled,
          hasError && classes.error,
          readOnly && classes.readonly,
          className,
        )}
        style={style}
      >
        <input
          className={classes.input}
          ref={ref}
          {...omit(['size', 'error'], rest)}
          {...inputProps}
        />
        <Label
          className={classes.label}
          htmlFor={inputProps.id}
          size={size}
          weight='regular'
        >
          <span>{children}</span>
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
});

Radio.displayName = 'Radio';
