import type { InputHTMLAttributes, ReactNode, SVGAttributes } from 'react';
import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Label, Paragraph } from '../../Typography';

import classes from './Radio.module.css';
import { useRadio } from './useRadio';

const RadioIcon = (props: SVGAttributes<SVGElement>) => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 22 22'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden
    {...props}
  >
    <circle
      className={classes.box}
      name='circle'
      cx='11'
      cy='11'
      r='10'
      fill='white'
      stroke='#00315D'
      strokeWidth='2'
    />
    <circle
      className={classes.checked}
      name='checked'
      cx='11'
      cy='11'
      r='4.88889'
      fill='#0062BA'
    />
  </svg>
);

export type RadioProps = {
  /**
   * Adds a description for label
   */
  description?: ReactNode;
  size?: 'xsmall' | 'small' | 'medium';
  error?: boolean;
  value: string | ReadonlyArray<string> | number | undefined;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'>;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ children, description, error, size: sizeProp, ...rest }, ref) => {
    const { inputProps, descriptionId, hasError, size } = useRadio({
      description,
      error,
      size: sizeProp,
      ...rest,
    });

    return (
      <Paragraph
        as='div'
        size={size}
        className={cn(
          classes.container,
          rest.disabled && classes.disabled,
          rest.readOnly && classes.readonly,
          (error || hasError) && classes.error,
          rest.className,
        )}
      >
        <span className={cn(classes.radio)}>
          <input
            {...rest}
            {...inputProps}
            className={classes.input}
            ref={ref}
          />
          <RadioIcon className={classes.icon} />
        </span>

        {children && (
          <Label
            className={classes.label}
            size={size}
            htmlFor={inputProps.id}
          >
            <span>{children}</span>
          </Label>
        )}
        {description && (
          <Paragraph
            id={descriptionId}
            as='div'
            size={size}
            className={classes.description}
          >
            {description}
          </Paragraph>
        )}
      </Paragraph>
    );
  },
);
