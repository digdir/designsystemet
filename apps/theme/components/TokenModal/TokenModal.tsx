'use client';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import {
  Heading,
  Ingress,
  Link,
  Modal,
  Paragraph,
} from '@digdir/designsystemet-react';
import { createTokens } from '@digdir/designsystemet/tokens/create.js';
import { CodeSnippet } from '@repo/components';
import { useEffect, useRef, useState } from 'react';

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
  JSON.stringify(obj, null, 2).replaceAll('$', '');

export const TokenModal = ({
  accentColor,
  neutralColor,
  brand1Color,
  brand2Color,
  brand3Color,
  borderRadius,
}: TokenModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const [lightThemeSnippet, setLightThemeSnippet] = useState('');
  const [darkThemeSnippet, setDarkThemeSnippet] = useState('');

  const cliSnippet = `npx @digdir/designsystemet tokens create \\
   --accent "${accentColor}" \\
   --neutral "${neutralColor}" \\
   --brand1 "${brand1Color}" \\
   --brand2 "${brand2Color}" \\
   --brand3 "${brand3Color}" \\
   --write
   `;

  useEffect(() => {
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

    setLightThemeSnippet(toFigmaSnippet(tokens.colors.light.theme));
    setDarkThemeSnippet(toFigmaSnippet(tokens.colors.dark.theme));
  }, []);

  return (
    <Modal.Root>
      <Modal.Trigger
        onClick={() => {
          return modalRef.current?.showModal();
        }}
      >
        Ta i bruk tema
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
        </Modal.Header>
        <Modal.Content className={classes.modalContent}>
          <Ingress size='xs' spacing>
            Velg et av alternativene under for å ta i bruk design-tokens med
            ditt tema.
          </Ingress>
          <Heading level={3} size='xs' spacing>
            Alt 1. Alle design tokens
          </Heading>
          <Paragraph spacing>
            Kopier kommandosnutten under og kjør på maskinen din for å generere
            alle design tokens (json-filer). Sørg for at du har{' '}
            <Link href='https://nodejs.org' target='_blank'>
              Node.js (åpnes i ny fane)
            </Link>{' '}
            installert på maskinen din.
          </Paragraph>
          <div
            className={classes.snippet}
            style={{ marginBottom: 'var(--ds-spacing-8)' }}
          >
            <CodeSnippet language='js'>{cliSnippet}</CodeSnippet>
          </div>
          <Heading level={3} size='xs' spacing>
            Alt 2. Designsystemet Figma plugin
          </Heading>
          <Paragraph spacing>
            JSON for bruk med Designsystemet{' '}
            <Link
              href='https://www.figma.com/community/plugin/1382044395533039221/designsystemet-beta'
              target='_blank'
            >
              Figma Plugin (åpnes i ny fane)
            </Link>{' '}
            og{' '}
            <Link
              href='https://www.figma.com/community/file/1322138390374166141/designsystemet-core-ui-kit'
              target='_blank'
            >
              Figma UI kit (åpnes i ny fane)
            </Link>
            .
          </Paragraph>
          <Paragraph spacing>
            Dette alternativet er kun ment for rask prototyping av valgt tema i
            Figma. For å bruke design tokens i produksjon, anbefales det å bruke
            alternativ 1.
          </Paragraph>
          <div className={classes.content}>
            <div className={classes.column}>
              <Heading level={4} size='2xs' spacing>
                Light Mode
              </Heading>
              <div className={classes.snippet}>
                <CodeSnippet language='js'>{lightThemeSnippet}</CodeSnippet>
              </div>
            </div>
            <div className={classes.column}>
              <Heading level={4} size='2xs' spacing>
                Dark Mode
              </Heading>
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
