'use client';

import {
  Button,
  Dialog,
  Divider,
  Heading,
  Input,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';
import {
  type CreateTokensOptions,
  cliOptions,
  formatThemeCSS,
} from '@digdir/designsystemet/tokens';
import { CodeBlock } from '@internal/components';
import { InformationSquareIcon, RocketIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';

import type { Color, CssColor } from '@digdir/designsystemet/color';
import { type ColorTheme, useThemeStore } from '../../store';
import { isProduction } from '../../utils/is-production';
import classes from './TokenModal.module.css';

const colorCliOptions = cliOptions.theme.colors;

const getBaseDefault = (colorTheme: Color[]) =>
  colorTheme.find((color) => color.name === 'base-default');

const LOADING_CSS_MESSAGE = 'Genererer CSS...';
const FEAT_THEME_CSS = false; // TODO set to false before merging

export const TokenModal = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const colors = useThemeStore((state) => state.colors);
  const baseBorderRadius = useThemeStore((state) => state.baseBorderRadius);

  const [themeName, setThemeName] = useState('theme');
  const [themeCSS, setThemeCSS] = useState('');

  const setCliColors = (colorTheme: ColorTheme[]) => {
    let str = '';
    for (const theme of colorTheme) {
      const baseColor = getBaseDefault(theme.colors.light);
      str += `"${theme.name}:${baseColor?.hex}" `;
    }
    return str;
  };

  const packageWithTag = `@digdir/designsystemet${isProduction() ? '' : '@next'}`;

  const buildSnippet = `npx ${packageWithTag} tokens build`;

  const cliSnippet = [
    `npx ${packageWithTag} tokens create`,
    `--${colorCliOptions.main} ${setCliColors(colors.main).trimEnd()}`,
    `--${colorCliOptions.neutral} "${getBaseDefault(colors.neutral[0]?.colors.light)?.hex}"`,
    `${colors.support.length > 0 ? `--${colorCliOptions.support} ${setCliColors(colors.support).trimEnd()}` : ''}`,
    `--border-radius ${baseBorderRadius}`,
    `--theme "${themeName}"`,
  ]
    .filter(Boolean)
    .join(' \\\n');

  const theme: CreateTokensOptions = {
    name: themeName,
    colors: {
      main: colors.main.reduce(
        (acc, color) => {
          acc[color.name] = getBaseDefault(color.colors.light)?.hex || '#';
          return acc;
        },
        {} as Record<string, CssColor>,
      ),
      support: colors.support.reduce(
        (acc, color) => {
          acc[color.name] = getBaseDefault(color.colors.light)?.hex || '#';
          return acc;
        },
        {} as Record<string, CssColor>,
      ),
      neutral: getBaseDefault(colors.neutral[0]?.colors.light)?.hex || '#',
    },
    borderRadius: baseBorderRadius,
    typography: {
      fontFamily: 'Inter',
    },
  };

  const onThemeButtonClick = () => {
    setThemeCSS(LOADING_CSS_MESSAGE);
    formatThemeCSS(theme).then(setThemeCSS);
  };

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger
        className={classes.trigger}
        onClick={() => {
          //return modalRef.current?.showModal();
        }}
      >
        <RocketIcon title='a11y-title' />
        Prototype: Kopier hex koder manuelt for testing i Figma
      </Dialog.Trigger>
      <Dialog
        className={classes.modal}
        style={{ maxWidth: 1000 }}
        ref={modalRef}
        closedby='any'
      >
        <Dialog.Block>
          <Heading className={classes.modalHeader} data-size='2xs'>
            <img src='img/emblem.svg' alt='' className={classes.emblem} />
            <span className={classes.headerText}>Ta i bruk tema</span>
          </Heading>
        </Dialog.Block>

        <Dialog.Block>
          <Heading className={classes.modalHeader} data-size='xs' level={3}>
            Gi temaet ditt et navn
          </Heading>
          <Paragraph>
            Navnet bør representere virksomheter eller produktet du skal
            profilere.
          </Paragraph>
          <Input
            aria-label='Navn på tema'
            name='themeName'
            value={themeName}
            onChange={(e) => {
              const value = e.currentTarget.value
                .replace(/\s+/g, '-')
                .replace(/[^A-Z0-9-]+/gi, '')
                .toLowerCase();

              setThemeName(value);
            }}
            style={{
              marginTop: 'var(--ds-size-6)',
            }}
          />
        </Dialog.Block>

        <Dialog.Block>
          <div className={classes.content}>
            <div className={classes.rightSection}>
              {FEAT_THEME_CSS && (
                <div className={classes['snippet-themecss']}>
                  <Button
                    onClick={onThemeButtonClick}
                    loading={themeCSS === LOADING_CSS_MESSAGE}
                  >
                    {themeCSS === LOADING_CSS_MESSAGE
                      ? LOADING_CSS_MESSAGE
                      : 'Generer CSS'}
                  </Button>
                  {themeCSS && themeCSS !== LOADING_CSS_MESSAGE && (
                    <CodeBlock language='css'>{themeCSS}</CodeBlock>
                  )}
                </div>
              )}
              <div className={classes.step}>
                <span>1</span>
                <Paragraph>
                  Kopier kodesnutten og kjør den på maskinen din for å generere
                  design tokens (json-filer), eller lim den inn i Designsystemet
                  sin{' '}
                  <Link
                    target='_blank'
                    href='https://www.figma.com/community/plugin/1382044395533039221/designsystemet-beta'
                  >
                    Figma plugin (åpnes i ny fane)
                  </Link>{' '}
                  i{' '}
                  <Link
                    target='_blank'
                    href='https://www.figma.com/community/file/1322138390374166141'
                  >
                    Core UI Kit (åpnes i ny fane)
                  </Link>{' '}
                  for å oppdatere et tema direkte i Figma. Les mer om disse
                  alternativene på{' '}
                  <Link
                    target='_blank'
                    href='https://www.designsystemet.no/grunnleggende/for-designere/eget-tema'
                  >
                    eget tema (åpnes i ny fane)
                  </Link>{' '}
                  siden.
                </Paragraph>
              </div>

              <div className={classes.snippet}>
                <CodeBlock language='bash'>{cliSnippet}</CodeBlock>
              </div>
              <div
                className={classes.step}
                style={{
                  marginTop: 'var(--ds-size-4)',
                }}
              >
                <span>2</span>
                <Paragraph>
                  Kjør kodesnutten for å generere CSS variabler til kode.
                </Paragraph>
              </div>
              <div className={classes.snippet}>
                <CodeBlock language='bash'>{buildSnippet}</CodeBlock>
              </div>

              <Divider />

              <div className={classes.contact}>
                <div className={classes.contact__icon}>
                  <InformationSquareIcon aria-hidden='true' fontSize='1.5rem' />
                </div>
                <div className={classes.contact__content}>
                  <Heading data-size='2xs'>Noe som ikke fungerer?</Heading>
                  <Paragraph data-size='sm'>
                    Send oss en melding på{' '}
                    <Link
                      target='_blank'
                      href='https://designsystemet.no/slack'
                    >
                      Slack (åpnes i ny fane)
                    </Link>{' '}
                    eller lag et{' '}
                    <Link
                      target='_blank'
                      href='https://github.com/digdir/designsystemet/issues/new/choose'
                    >
                      Github issue (åpnes i ny fane)
                    </Link>
                    .
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Block>
      </Dialog>
    </Dialog.TriggerContext>
  );
};
