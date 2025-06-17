import {
  Button,
  Dialog,
  Divider,
  Heading,
  Input,
  Link,
  Paragraph,
  Switch,
} from '@digdir/designsystemet-react';
import {
  type CreateTokensOptions,
  cliOptions,
  formatThemeCSS,
} from '@digdir/designsystemet/tokens';
import { InformationSquareIcon, StarIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { Color, CssColor } from '@digdir/designsystemet/color';
import { CodeBlock } from '@internal/components';
import { useLoaderData } from 'react-router';
import { type ColorTheme, useThemeStore } from '~/store';
import classes from './token-modal.module.css';

const colorCliOptions = cliOptions.theme.colors;

const getBaseDefault = (colorTheme: Color[]) =>
  colorTheme.find((color) => color.name === 'base-default');

const LOADING_CSS_MESSAGE = 'Generating CSS...';
const FEAT_THEME_CSS = false; // TODO set to false before merging

export const TokenModal = () => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDialogElement>(null);
  const { isProduction } = useLoaderData();

  // Use separate selectors for better performance
  const colors = useThemeStore((state) => state.colors);
  const baseBorderRadius = useThemeStore((state) => state.baseBorderRadius);

  const [themeName, setThemeName] = useState('theme');
  const [themeCSS, setThemeCSS] = useState('');
  const [formatWin, setFormatWin] = useState(
    navigator.userAgent.includes('Windows'),
  );

  const setCliColors = (colorTheme: ColorTheme[]) => {
    if (!colorTheme.length) return '';

    return (
      colorTheme
        .map((theme) => {
          const baseColor = getBaseDefault(theme.colors.light);
          return `"${theme.name}:${baseColor?.hex}"`;
        })
        .join(' ') + ' '
    );
  };

  const packageWithTag = `@digdir/designsystemet${isProduction ? '@latest' : '@next'}`;
  const buildSnippet = `npx ${packageWithTag} tokens build`;
  const seperator = formatWin ? ' ^\n' : ' \\\n';

  const cliSnippet = [
    `npx ${packageWithTag} tokens create`,
    `--${colorCliOptions.main} ${setCliColors(colors.main).trimEnd()}`,
    `--${colorCliOptions.neutral} "${getBaseDefault(colors.neutral[0]?.colors.light)?.hex}"`,
    `${colors.support.length > 0 ? `--${colorCliOptions.support} ${setCliColors(colors.support).trimEnd()}` : ''}`,
    `--border-radius ${baseBorderRadius}`,
    `--theme "${themeName}"`,
  ]
    .filter(Boolean)
    .join(seperator);

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
    if (themeCSS !== LOADING_CSS_MESSAGE) {
      setThemeCSS(LOADING_CSS_MESSAGE);

      formatThemeCSS(theme).then((css) => {
        setThemeCSS(css);
      });
    }
  };

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger
        className={classes.trigger}
        onClick={() => {
          return modalRef.current?.showModal();
        }}
      >
        <StarIcon aria-hidden fontSize='1.5rem' />
        {t('themeModal.use-theme')}
      </Dialog.Trigger>
      <Dialog
        className={classes.modal}
        style={{ maxWidth: 1000 }}
        ref={modalRef}
        closedby='any'
      >
        <Dialog.Block>
          <Heading className={classes.modalHeader} data-size='2xs'>
            <img src='/img/emblem.svg' alt='' className={classes.emblem} />
            <span className={classes.headerText}>
              {t('themeModal.use-theme')}
            </span>
          </Heading>
        </Dialog.Block>
        <Dialog.Block>
          <Heading className={classes.modalHeader} data-size='xs' level={3}>
            {t('themeModal.theme-name')}
          </Heading>
          <Paragraph>{t('themeModal.theme-name-description')}</Paragraph>
          <Input
            aria-label={t('themeModal.theme-name-label')}
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
                      ? t('themeModal.generating-css')
                      : t('themeModal.generate-css')}
                  </Button>
                  {themeCSS && themeCSS !== LOADING_CSS_MESSAGE && (
                    <CodeBlock language='css'>{themeCSS}</CodeBlock>
                  )}
                </div>
              )}{' '}
              <div className={classes.step}>
                <span>1</span>
                <Paragraph>
                  {t('themeModal.step-one')}{' '}
                  <Link
                    target='_blank'
                    href='https://www.figma.com/community/plugin/1382044395533039221/designsystemet-beta'
                  >
                    {t('themeModal.figma-plugin')}
                  </Link>{' '}
                  {t('themeModal.in')}{' '}
                  <Link
                    target='_blank'
                    href='https://www.figma.com/community/file/1322138390374166141'
                  >
                    {t('themeModal.core-ui-kit')}
                  </Link>{' '}
                  {t('themeModal.to-update')}{' '}
                  <Link
                    target='_blank'
                    href='https://www.designsystemet.no/no/fundamentals/for-designers/own-theme'
                  >
                    {t('themeModal.own-theme')}
                  </Link>{' '}
                  {t('themeModal.page')}
                </Paragraph>
              </div>
              <div className={classes.snippet}>
                <CodeBlock language='bash'>{cliSnippet}</CodeBlock>
                <Switch
                  style={{ marginBlockEnd: 'var(--ds-size-4)' }}
                  label={t('themeModal.format')}
                  checked={formatWin}
                  onChange={(e) => {
                    setFormatWin(e.currentTarget.checked);
                  }}
                />
              </div>
              <div
                className={classes.step}
                style={{
                  marginTop: 'var(--ds-size-4)',
                }}
              >
                <span>2</span>
                <Paragraph>{t('themeModal.step-two')}</Paragraph>
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
                  <Heading data-size='2xs'>
                    {t('themeModal.help-heading')}
                  </Heading>
                  <Paragraph data-size='sm'>
                    {t('themeModal.help-description')}{' '}
                    <Link
                      target='_blank'
                      href='https://designsystemet.no/slack'
                    >
                      {t('themeModal.slack')}
                    </Link>{' '}
                    {t('themeModal.or')}{' '}
                    <Link
                      target='_blank'
                      href='https://github.com/digdir/designsystemet/issues/new/choose'
                    >
                      {t('themeModal.github-issue')}
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
