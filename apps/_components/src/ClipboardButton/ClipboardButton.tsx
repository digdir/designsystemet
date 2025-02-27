'use client';
import { Button, Tooltip } from '@digdir/designsystemet-react';
import { ClipboardIcon } from '@navikt/aksel-icons';
import { useState } from 'react';

import classes from './ClipboardButton.module.css';

interface ClipboardButtonProps {
  title?: string;
  value: string;
  text?: string;
  ariaLabel?: string;
}

export const ClipboardButton = ({
  title = 'Kopier',
  value,
  text,
  ariaLabel,
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
          onMouseEnter={() =>
            setToolTipText(title === 'Kopier' && ariaLabel ? ariaLabel : title)
          }
          onClick={() => onBtnClick(value)}
          icon={!text}
          variant='tertiary'
          data-color='neutral'
          data-size='sm'
          aria-label={ariaLabel}
        >
          <ClipboardIcon fontSize={'1.4rem'} aria-hidden='true' />
          {text && <span className={classes.text}>{text}</span>}
        </Button>
      </Tooltip>
    </>
  );
};
