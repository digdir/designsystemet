import { Button } from '@digdir/designsystemet-react';
import { PencilIcon } from '@navikt/aksel-icons';

import classes from './ColorInput.module.css';

type ColorInputProps = {
  color: string;
  name: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ColorInput = ({ name, color, onClick }: ColorInputProps) => {
  return (
    <div className={classes.component}>
      <div className={classes.name}>{name}</div>
      <Button
        className={classes.box}
        onClick={(e) => onClick(e)}
        variant='secondary'
        data-color='neutral'
        aria-label={`Endre instillinger ${name}`}
      >
        <div className={classes.leftContent}>
          <div
            style={{ backgroundColor: color }}
            className={classes.color}
          ></div>
          <div className={classes.hex}>{color}</div>
        </div>
        <PencilIcon className={classes.icon} aria-hidden fontSize='1.5rem' />
      </Button>
    </div>
  );
};
