'use client';

import { type CssColor, Theme } from '@adobe/leonardo-contrast-colors';
import {
  Button,
  Heading,
  Modal,
  Paragraph,
  Tooltip,
} from '@digdir/designsystemet-react';
import { createTokens } from '@digdir/designsystemet/tokens';
import { ArrowForwardIcon } from '@navikt/aksel-icons';
import { CodeSnippet } from '@repo/components';
import { use, useEffect, useRef, useState } from 'react';

import classes from './TokenModal.module.css';

type TokenModalProps = {
  accentColor: CssColor;
  neutralColor: CssColor;
  brand1Color: CssColor;
  brand2Color: CssColor;
  brand3Color: CssColor;
  borderRadius: string;
};

const toFigmaSnippet = (obj: unknown) =>
  JSON.stringify(obj, null, 2).replace('$', '');

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

  const cliSnippet = `npx @digdir/designsystemet tokens create \\
   --accent "${accentColor}" \\
   --neutral "${neutralColor}" \\
   --brand1 "${brand1Color}" \\
   --brand2 "${brand2Color}" \\
   --brand3 "${brand3Color}" \\
   --write
   `;

  const onButtonClick = () => {
    setToolTipText('Kopiert!');
    navigator.clipboard.writeText(window.location.href).catch((reason) => {
      throw Error(String(reason));
    });
  };

  const tokens = createTokens({
    colors: {
      accent: accentColor,
      neutral: neutralColor,
      brand1: brand1Color,
      brand2: brand2Color,
      brand3: brand3Color,
    },
    typography: { fontFamily: 'Inter' },
  });

  const lightThemeSnippet = toFigmaSnippet({
    theme: tokens.colors.light.theme,
  });
  const darkThemeSnippet = toFigmaSnippet({ theme: tokens.colors.dark.theme });

  return (
    <Modal.Root>
      <Modal.Trigger
        onClick={() => {
          return modalRef.current?.showModal();
        }}
      >
        Last ned tema
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
          <Paragraph spacing>
            Kopier kommandosnutten under og kjør den på maskinen din for å
            generere design tokens (json-filer) basert på fargene du har valgt.
          </Paragraph>
          <div className={classes.snippet}>
            <CodeSnippet language='js'>{cliSnippet}</CodeSnippet>
          </div>
          <div className={classes.content}>
            <Heading level={2}>Figma plugin</Heading>
            <Paragraph spacing>
              Kopier kommandosnutten under og kjør den på maskinen din for å
              generere design tokens (json-filer) basert på fargene du har
              valgt.
            </Paragraph>
            <div className={classes.column}>
              <div className={classes.snippet}>
                <CodeSnippet language='js'>{lightThemeSnippet}</CodeSnippet>
              </div>
            </div>
            <div className={classes.column}>
              <div className={classes.snippet}>
                <CodeSnippet language='js'>{darkThemeSnippet}</CodeSnippet>
              </div>
            </div>
          </div>
        </Modal.Content>
      </Modal.Dialog>
    </Modal.Root>
  );
};
