'use client';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import {
  Button,
  Heading,
  Modal,
  Tabs,
  Tooltip,
} from '@digdir/designsystemet-react';
import { ArrowForwardIcon } from '@navikt/aksel-icons';
import { CodeSnippet } from '@repo/components';
import { useRef, useState } from 'react';

import classes from './TokenModal.module.css';

type TokenModalProps = {
  accentColor: CssColor;
  neutralColor: CssColor;
  brand1Color: CssColor;
  brand2Color: CssColor;
  brand3Color: CssColor;
  borderRadius: string;
};

export const TokenModal = ({
  accentColor,
  neutralColor,
  brand1Color,
  brand2Color,
  brand3Color,
  borderRadius,
}: TokenModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const [toolTipText, setToolTipText] = useState('Kopier nettaddresse');

  const cliSnippet = `npx @digdir/designsystemet tokens create --write --accent "${accentColor}" --neutral "${neutralColor}" --brand1 "${brand1Color}" --brand2 "${brand2Color}" --brand3 "${brand3Color}"`;

  const onButtonClick = () => {
    setToolTipText('Kopiert!');
    navigator.clipboard.writeText(window.location.href).catch((reason) => {
      throw Error(String(reason));
    });
  };

  return (
    <Modal.Root>
      <Modal.Trigger
        onClick={() => {
          return modalRef.current?.showModal();
        }}
      >
        Kopier tema
      </Modal.Trigger>
      <Modal.Dialog
        ref={modalRef}
        onInteractOutside={() => modalRef.current?.close()}
        style={{
          maxWidth: '1400px',
        }}
        className={classes.modal}
      >
        <Modal.Header className={classes.modalHeader}>
          <img src='img/emblem.svg' alt='' className={classes.emblem} />
          <span className={classes.headerText}>Kopier fargetema</span>
          <Tooltip content={toolTipText} portal={false}>
            <Button
              className={classes.shareBtn}
              variant='tertiary'
              color='neutral'
              size='sm'
              onClick={() => onButtonClick()}
              onMouseEnter={() => setToolTipText('Kopier nettadresse')}
              autoFocus
            >
              Del
              <ArrowForwardIcon title='a11y-title' fontSize='1.5rem' />
            </Button>
          </Tooltip>
        </Modal.Header>
        <Modal.Content className={classes.modalContent}>
          <div className={classes.content}>
            <div className={classes.snippet}>
              <CodeSnippet language='js'>{cliSnippet}</CodeSnippet>
            </div>
          </div>
        </Modal.Content>
      </Modal.Dialog>
    </Modal.Root>
  );
};
