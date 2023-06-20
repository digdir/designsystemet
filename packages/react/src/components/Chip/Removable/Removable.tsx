import React, { forwardRef } from 'react';
import cn from 'classnames';
import { XMarkIcon } from '@navikt/aksel-icons';

import type { ChipButtonProps } from '../_ChipButton';
import { ChipButton } from '../_ChipButton';
import type { OverridableComponent } from '../../../types/OverridableComponent';

import classes from './Removable.module.css';

type RemovableChipProps = Omit<ChipButtonProps, 'selected'>;

export const RemovableChip: OverridableComponent<
  RemovableChipProps,
  HTMLButtonElement
> = forwardRef(({ children, size = 'xsmall', ...rest }, ref): JSX.Element => {
  return (
    <ChipButton
      {...rest}
      ref={ref}
      size={size}
      className={cn(classes.removable, classes[size], rest.className)}
    >
      <div className={classes.container}>
        <div>{children}</div>
        <div
          className={classes.xMark}
          aria-hidden
        >
          <XMarkIcon className={classes.iconSize} />
        </div>
      </div>
    </ChipButton>
  );
});
