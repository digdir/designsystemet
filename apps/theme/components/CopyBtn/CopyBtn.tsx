import { FilesIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Button, Tooltip } from '@digdir/designsystemet-react';

import classes from './Copybtn.module.css';

type CopyBtnProps = {
  text: string;
};

export const CopyBtn = ({ text }: CopyBtnProps) => {
  const [popupText, setPopupText] = useState('Kopier');
  return (
    <Tooltip
      content={popupText}
      placement='top'
      portal={false}
    >
      <Button
        className={classes.btn}
        onClick={() => {
          setPopupText('Kopiert!');
          void navigator.clipboard.writeText(text);
        }}
        variant='secondary'
        size='sm'
        onMouseEnter={() => setPopupText('Kopier')}
      >
        <FilesIcon />
      </Button>
    </Tooltip>
  );
};
