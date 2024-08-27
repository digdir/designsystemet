'use client';
import { Button, Tooltip } from '@digdir/designsystemet-react';
import { ClipboardIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

import classes from './ClipboardButton.module.css';

interface ClipboardButtonProps {
  title?: string;
  value: string;
  text?: string;
}

export const ClipboardButton = ({
  title = 'Kopier',
  value,
  text,
}: ClipboardButtonProps) => {
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
          color='neutral'
          size='sm'
        >
          <ClipboardIcon fontSize={'1.4rem'} />
          {text && <span className={classes.text}>{text}</span>}
        </Button>
      </Tooltip>
    </>
  );
};
