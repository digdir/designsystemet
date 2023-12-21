import type { InputHTMLAttributes, ReactNode, SVGAttributes } from 'react';
import React, { forwardRef } from 'react';
import cl from 'clsx';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import { omit } from '../../../utilities';
import { Label, Paragraph } from '../../Typography';
import type { FormFieldProps } from '../useFormField';

import classes from './Switch.module.css';
import { useSwitch } from './useSwitch';

const SwitchIcon = (props: SVGAttributes<SVGElement>) => (
  <svg
    width='54'
    height='32'
    viewBox='0 0 56 34'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <rect
      className={classes.track}
      x='1'
      y='1'
      width='54'
      height='32'
      rx='16'
      stroke='currentcolor'
      strokeWidth='2px'
      strokeLinejoin='round'
      fill='currentcolor'
    />
    <g className={classes.thumb}>
      <circle
        cx='17'
        cy='17'
        width='30'
        height='30'
        r='14'
        fill='currentcolor'
      />
      <path
        className={classes.checkmark}
        fillRule='evenodd'
        clipRule='evenodd'
        d='M18.1958 5.63756C18.8792 6.32098 18.8792 7.42902 18.1958 8.11244L10.4041 15.9041C9.72068 16.5875 8.61264 16.5875 7.92922 15.9041L3.80422 11.7791C3.1208 11.0957 3.1208 9.98765 3.80422 9.30423C4.48764 8.62081 5.59568 8.62081 6.27909 9.30423L9.16666 12.1918L15.7209 5.63756C16.4043 4.95415 17.5123 4.95415 18.1958 5.63756Z'
        fill='currentcolor'
      />
    </g>
  </svg>
);

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
    const { children, description, position = 'left', ...rest } = props;
    const {
      inputProps,
      descriptionId,
      size = 'medium',
      readOnly,
    } = useSwitch(props);

    return (
      <Paragraph
        as='div'
        size={size}
        className={cl(
          classes.switch,
          classes[size],
          inputProps.disabled && classes.disabled,
          readOnly && classes.readonly,
          position === 'right' && classes.right,
          !children && classes.noLabel,
          rest.className,
        )}
      >
        <input
          {...omit(['size', 'error'], rest)}
          {...inputProps}
          className={classes.input}
          ref={ref}
        />
        <SwitchIcon className={classes.icon} />

        {children && (
          <Label
            className={classes.label}
            htmlFor={inputProps.id}
            size={size}
            weight='regular'
          >
            {readOnly && (
              <PadlockLockedFillIcon
                aria-hidden
                className={classes.padlock}
              />
            )}
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
