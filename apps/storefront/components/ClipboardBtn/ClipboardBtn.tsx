import { useState } from 'react';
import { ClipboardIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@digdir/designsystemet-react';

import classes from './ClipboardBtn.module.css';

interface ClipboardBtnProps {
  title: string;
  value: string;
  text?: string;
}

const ClipboardBtn = ({ title, value, text = '' }: ClipboardBtnProps) => {
  const [toolTipText, setToolTipText] = useState('Kopier');

  const onBtnClick = (text: string) => {
    setToolTipText('Kopiert!');
    navigator.clipboard.writeText(text).catch((reason) => {
      throw Error(String(reason));
    });
  };

  return (
    <>
      <Tooltip content={toolTipText}>
        <button
          onMouseEnter={() => setToolTipText(title)}
          onClick={() => onBtnClick(value)}
          className={classes.btn}
          title={title}
        >
          <ClipboardIcon
            fontSize={20}
            color='#585858'
          />
          {text && <span className={classes.text}>{text}</span>}
        </button>
      </Tooltip>
    </>
  );
};

export { ClipboardBtn };
