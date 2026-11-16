import pkg from '@digdir/designsystemet/package.json';
import {
  Button,
  Dialog,
  Heading,
  Link,
  Paragraph,
} from '@digdir/designsystemet-react';
import { InformationSquareIcon, StarIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';
import { useThemeStore } from '~/model/theme-store';
import type { loader } from '~/routes/themebuilder/themebuilder';
import { ConfigFileSection } from './config-file-section';
import { CssFileSection } from './css-file-section';
import classes from './export-theme-dialog.module.css';
import { useThemeCss } from './use-theme-css';

/** A button that opens a dialog with the two ways to use the theme: a config file for the CLI, or the CSS file */
export const ExportThemeDialog = () => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { workspace } = useThemeStore();
  const { isProduction } = useLoaderData<typeof loader>();
  const { themes } = workspace.config;
  // Generating the CSS takes a moment, so only do it while the dialog is open.
  const [isOpen, setIsOpen] = useState(false);
  // Which theme to show the CSS file for, when the config has several themes
  const [chosenTheme, setChosenTheme] = useState(workspace.activeTheme);
  const cssThemeName = Object.hasOwn(themes, chosenTheme)
    ? chosenTheme
    : workspace.activeTheme;
  const themeCss = useThemeCss(cssThemeName, themes[cssThemeName], isOpen);

  /* The config file is the theme store's config, with the schema of this version: the theme builder
   * writes the config the way this version does, also when it was imported from an older one. */
  const {
    $schema: _,
    ...config
  }: typeof workspace.config & {
    $schema?: string;
  } = workspace.config;
  const configJson = isOpen
    ? JSON.stringify(
        {
          $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
          ...config,
        },
        null,
        2,
      )
    : '';

  return (
    <>
      <Button
        className={classes.trigger}
        aria-haspopup='dialog'
        onClick={() => {
          setIsOpen(true);
          setChosenTheme(workspace.activeTheme);
          dialogRef.current?.showModal();
        }}
      >
        <StarIcon aria-hidden />
        {t('exportTheme.use-theme')}
      </Button>
      <Dialog
        className={classes.dialog}
        ref={dialogRef}
        closedby='any'
        onClose={() => setIsOpen(false)}
      >
        <Dialog.Block>
          <Heading className={classes.header} data-size='2xs'>
            <img src='/img/emblem.svg' alt='' className={classes.emblem} />
            <span className={classes.headerText}>
              {t('exportTheme.use-theme')}
            </span>
          </Heading>
        </Dialog.Block>
        <Dialog.Block>
          {/* Two ways to use the theme, side by side: a config file for the CLI, or the generated CSS file. */}
          <div className={classes.content}>
            <section className={classes.configSection}>
              <Heading data-size='xs' level={3}>
                {t('exportTheme.config.heading')}
              </Heading>
              <Paragraph>{t('exportTheme.config.description')}</Paragraph>
              <ConfigFileSection
                configSnippet={configJson}
                buildSnippet={`npx @digdir/designsystemet${isProduction ? '@latest' : '@next'}`}
              />
            </section>
            <section className={classes.cssSection}>
              <Heading data-size='xs' level={3}>
                {t('exportTheme.css.heading')}
              </Heading>
              <Paragraph>{t('exportTheme.css.description')}</Paragraph>
              <CssFileSection
                themeName={cssThemeName}
                themeNames={Object.keys(themes)}
                onThemeChange={setChosenTheme}
                {...themeCss}
              />
            </section>
          </div>
        </Dialog.Block>
        <Dialog.Block>
          <div className={classes.help}>
            <div className={classes.helpIcon}>
              <InformationSquareIcon
                aria-hidden='true'
                height='1.5rem'
                width='1.5rem'
              />
            </div>
            <div className={classes.helpContent}>
              <Heading data-size='2xs'>{t('exportTheme.help-heading')}</Heading>
              <Paragraph data-size='sm'>
                {t('exportTheme.help-description')}{' '}
                <Link target='_blank' href='https://designsystemet.no/slack'>
                  {t('exportTheme.slack')}
                </Link>{' '}
                {t('exportTheme.or')}{' '}
                <Link
                  target='_blank'
                  href='https://github.com/digdir/designsystemet/issues/new/choose'
                >
                  {t('exportTheme.github-issue')}
                </Link>
                .
              </Paragraph>
            </div>
          </div>
        </Dialog.Block>
      </Dialog>
    </>
  );
};
