import { CheckmarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx';

import classes from '../Option.module.css';

type SelectedIconProps = {
  multiple: boolean;
  selected: boolean;
};

export const SelectedIcon = ({ multiple, selected }: SelectedIconProps) => {
  return (
    <div className={cl(multiple && classes.selectIconWrapper, selected && classes.selected)}>
      {selected && (
        <CheckmarkIcon
          className={classes.selectIcon}
          aria-hidden
        />
      )}
    </div>
  );
};

SelectedIcon.displayName = 'SelectedIcon';

export default SelectedIcon;
