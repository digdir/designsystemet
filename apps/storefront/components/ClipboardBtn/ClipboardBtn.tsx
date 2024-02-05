import { useState } from 'react';
import { ClipboardIcon } from '@navikt/aksel-icons';
import Tippy from '@tippyjs/react';

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
      <Tippy
        content={toolTipText}
        hideOnClick={false}
        className={classes.tippy}
      >
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
      </Tippy>
    </>
  );
};

export { ClipboardBtn };
