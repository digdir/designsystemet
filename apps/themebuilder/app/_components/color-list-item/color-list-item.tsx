import { Button } from '@digdir/designsystemet-react';
import { PencilIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';

import classes from './color-list-item.module.css';

type ColorListItemProps = {
  color: string;
  name: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const ColorListItem = ({ name, color, onClick }: ColorListItemProps) => {
  const { t } = useTranslation();
  return (
    <div className={classes.item}>
      <div className={classes.name}>{name}</div>
      <Button
        className={classes.button}
        onClick={(e) => onClick(e)}
        variant='secondary'
        data-color='neutral'
        aria-label={`${t('colorEditor.edit-color')} ${name}, ${color}`}
        data-color-name={name}
      >
        <span className={classes.leftContent}>
          <span
            style={{ backgroundColor: color }}
            className={classes.color}
          ></span>
          <span className={classes.hex}>{color}</span>
        </span>
        <PencilIcon aria-hidden />
      </Button>
    </div>
  );
};
