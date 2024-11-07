import { PencilIcon } from '@navikt/aksel-icons';

import classes from './ColorInput.module.css';

type ColorInputProps = {
  color: string;
  name: string;
};

export const ColorInput = ({ name, color }: ColorInputProps) => {
  return (
    <div className={classes.component}>
      <div className={classes.name}>{name}</div>
      <button className={classes.box}>
        <div className={classes.leftContent}>
          <div
            style={{ backgroundColor: color }}
            className={classes.color}
          ></div>
          <div className={classes.hex}>{color}</div>
        </div>
        <PencilIcon
          className={classes.icon}
          title='a11y-title'
          fontSize='1.5rem'
        />
      </button>
    </div>
  );
};
