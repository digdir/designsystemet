import { FilesIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { Tooltip } from '@digdir/designsystemet-react';

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
      <button
        className={classes.btn}
        onClick={() => {
          setPopupText('Kopiert!');
          void navigator.clipboard.writeText(text);
        }}
        onMouseEnter={() => setPopupText('Kopier')}
      >
        <FilesIcon />
      </button>
    </Tooltip>
  );
};
