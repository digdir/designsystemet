import React, { useState } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import Tippy from '@tippyjs/react';

import classes from './ClipboardBtn.module.css';

interface ClipboardBtnProps {
  text: string;
  value?: string;
}

const ClipboardBtn = ({ text, value = 'Kopier' }: ClipboardBtnProps) => {
  const [toolTipText, setToolTipText] = useState('Kopier');

  const onClick = (text: string) => {
    setToolTipText('Kopiert!');
    navigator.clipboard.writeText('--' + text).catch((reason) => {
      throw Error(String(reason));
    });
  };

  return (
    <div>
      <Tippy
        content={toolTipText}
        hideOnClick={false}
        className={classes.tippy}
      >
        <button
          onMouseEnter={() => setToolTipText(text)}
          onClick={() => onClick(value)}
          className={classes.btn}
          title={text}
        >
          <FilesIcon
            fontSize={21}
            color='#585858'
          />
        </button>
      </Tippy>
    </div>
  );
};

export { ClipboardBtn };
