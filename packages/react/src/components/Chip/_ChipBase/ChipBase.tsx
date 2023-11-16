import type { ButtonHTMLAttributes } from 'react';
import React, { useContext, forwardRef } from 'react';
import cn from 'classnames';

import { Paragraph } from '../../Typography';
import type { OverridableComponent } from '../../../types/OverridableComponent';
import { ChipGroupContext } from '../Group';
import utilityClasses from '../../../utilities/utility.module.css';
import classes from '../Chip.module.css';

export type ChipBaseProps = {
  /**
   * Changes padding and font-sizes.
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Toggles `aria-pressed` and visual-changes
   * */
  selected?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ChipBase: OverridableComponent<ChipBaseProps, HTMLLabelElement> =
  forwardRef(
    (
      {
        size = 'medium',
        children,
        selected,
        className,
        as: Component = 'button',
        ...rest
      },
      ref,
    ): JSX.Element => {
      const group = useContext(ChipGroupContext);
      return (
        <Component
          {...rest}
          ref={ref}
          aria-pressed={selected}
          className={cn(
            classes.chipButton,
            utilityClasses.focusable,
            classes[group?.size || size],
            className,
          )}
        >
          <Paragraph
            as='span'
            size={size}
            className={classes.label}
          >
            {children}
          </Paragraph>
        </Component>
      );
    },
  );
