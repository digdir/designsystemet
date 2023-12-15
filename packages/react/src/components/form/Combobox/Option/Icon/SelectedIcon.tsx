import React from 'react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';

import classes from '../Option.module.css';

type SelectedIconProps = {
  multiple: boolean;
  selected: boolean;
};

export const SelectedIcon = ({ multiple, selected }: SelectedIconProps) => {
  return (
    <div
      className={cn(
        multiple && classes.selectIconWrapper,
        selected && classes.selected,
      )}
    >
      {selected && (
        <CheckmarkIcon
          className={classes.selectIcon}
          aria-hidden
        />
      )}
    </div>
  );
};

export default SelectedIcon;
