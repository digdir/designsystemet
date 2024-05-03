import { useState } from 'react';
import { ClipboardIcon } from '@navikt/aksel-icons';
import { Tooltip, Button } from '@digdir/designsystemet-react';

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
        <Button
          onMouseEnter={() => setToolTipText(title)}
          onClick={() => onBtnClick(value)}
          title={title}
          variant='tertiary'
          color='second'
          size='small'
        >
          <ClipboardIcon fontSize={'1.4rem'} />
          {text && <span className={classes.text}>{text}</span>}
        </Button>
      </Tooltip>
    </>
  );
};

export { ClipboardBtn };
