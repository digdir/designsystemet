import React, { useState } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import Tippy from '@tippyjs/react';

import classes from './ClipboardBtn.module.css';

interface ClipboardBtnProps {
  text: string;
}

const ClipboardBtn = ({ text }: ClipboardBtnProps) => {
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
          onMouseEnter={() => setToolTipText('Kopier')}
          onClick={() => onClick(text)}
          className={classes.btn}
          title='Kopier'
        >
          <FilesIcon
            fontSize={24}
            color='#585858'
          />
        </button>
      </Tippy>
    </div>
  );
};

export { ClipboardBtn };
