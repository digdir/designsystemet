'use client';

import type { CssColor } from '@adobe/leonardo-contrast-colors';
import {
  Heading,
  Link,
  Modal,
  Paragraph,
  Textfield,
} from '@digdir/designsystemet-react';
import { createTokens } from '@digdir/designsystemet/tokens/create.js';
import { CodeIcon, InformationSquareIcon } from '@navikt/aksel-icons';
import { CodeSnippet } from '@repo/components';
import { useEffect, useRef, useState } from 'react';

import cl from 'clsx/lite';

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
  const [themeName, setThemeName] = useState('theme');

  const cliSnippet = `npx @digdir/designsystemet tokens create \\
   --accent "${accentColor}" \\
   --neutral "${neutralColor}" \\
   --brand1 "${brand1Color}" \\
   --brand2 "${brand2Color}" \\
   --brand3 "${brand3Color}" \\
   --theme "${themeName}" \\
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
      themeName: 'theme',
    });

    setLightThemeSnippet(toFigmaSnippet(tokens.colors.light.theme));
    setDarkThemeSnippet(toFigmaSnippet(tokens.colors.dark.theme));
  }, []);

  return (
    <Modal.Context>
      <Modal.Trigger
        onClick={() => {
          return modalRef.current?.showModal();
        }}
      >
        Ta i bruk tema
      </Modal.Trigger>
      <Modal
        className={classes.modal}
        style={{ maxWidth: 1150 }}
        ref={modalRef}
        backdropClose={true}
      >
        <Heading className={classes.modalHeader} size='xs'>
          <img src='img/emblem.svg' alt='' className={classes.emblem} />
          <span className={classes.headerText}>Ta i bruk tema</span>
        </Heading>

        <div className={classes.content}>
          <div className={classes.leftSection}>
            <Textfield
              label='Navn på tema'
              description="Kun bokstaver, tall og bindestrek. Eks: 'mitt-tema'"
              value={themeName}
              size='sm'
              onChange={(e) => {
                const value = e.currentTarget.value
                  .replace(/\s+/g, '-')
                  .replace(/[^A-Z0-9-]+/gi, '')
                  .toLowerCase();

                setThemeName(value);
              }}
            />
            <div className={classes.infoBoxes}>
              <div className={classes.infoBox}>
                <div className={classes.infoBox__left}>
                  <div
                    className={cl(
                      classes.infoBox__icon,
                      classes['infoBox__icon--code'],
                    )}
                  >
                    <CodeIcon aria-hidden='true' fontSize='1.9rem' />
                  </div>
                </div>
                <div className={classes.infoBox__right}>
                  <div className={classes.infoBox__container}>
                    <Heading size='2xs'>Design tokens</Heading>
                    <Paragraph size='sm'>
                      Kopier kodesnutten og kjør den på maskinen din for å
                      generere design tokens (json-filer). Sørg for at du har{' '}
                      <Link target='_blank' href='https://nodejs.org/'>
                        Node.js
                      </Link>{' '}
                      installert på maskinen din.
                    </Paragraph>
                  </div>
                </div>
              </div>
              <div className={classes.infoBox}>
                <div className={classes.infoBox__left}>
                  <div className={classes.infoBox__icon}>
                    <img src='img/figma-logo.png' alt='' />
                  </div>
                </div>
                <div className={classes.infoBox__right}>
                  <div className={classes.infoBox__container}>
                    <Heading size='2xs'>Figma plugin (under utvikling)</Heading>
                    <Paragraph size='sm'>
                      Kopier kodesnutten og lim den inn i Designsystemet sin{' '}
                      <Link
                        target='_blank'
                        href='https://www.figma.com/community/plugin/1382044395533039221/designsystemet-beta'
                      >
                        Figma plugin
                      </Link>{' '}
                      når du er i{' '}
                      <Link
                        target='_blank'
                        href='https://www.figma.com/community/file/1322138390374166141'
                      >
                        Core UI Kit
                      </Link>{' '}
                      for å oppdatere et tema. Pluginen er kun ment for rask
                      prototyping for øyeblikket. Bruk alternativet over for
                      produksjon.
                    </Paragraph>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.rightSection}>
            <div className={classes.snippet}>
              <CodeSnippet syntax='shell'>{cliSnippet}</CodeSnippet>
            </div>
            <div className={classes.contact}>
              <div className={classes.contact__icon}>
                <InformationSquareIcon aria-hidden='true' fontSize='1.5rem' />
              </div>
              <div className={classes.contact__content}>
                <Heading size='2xs'>Noe som ikke fungerer?</Heading>
                <Paragraph size='sm'>
                  Send oss en melding på{' '}
                  <Link
                    target='_blank'
                    href='https://join.slack.com/t/designsystemet/shared_invite/zt-2438eotl3-a4266Vd2IeqMWO8TBw5PrQ'
                  >
                    Slack
                  </Link>{' '}
                  eller lag et{' '}
                  <Link
                    target='_blank'
                    href='https://github.com/digdir/designsystemet/issues/new/choose'
                  >
                    Github issue
                  </Link>
                  .
                </Paragraph>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Modal.Context>
  );
};
