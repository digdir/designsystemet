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
import classes from './export-theme-modal.module.css';
import { Config } from './steps/config';
import { Css } from './steps/css';
import { useThemeCss } from './use-theme-css';

/** A button that opens a dialog with the two ways to use the theme: a config file for the CLI, or the CSS file */
export const ExportThemeModal = () => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDialogElement>(null);
  const { workspace } = useThemeStore();
  const { isProduction } = useLoaderData<typeof loader>();
  const { themes } = workspace.config;
  // Generating the CSS takes a moment, so only do it while the modal is open.
  const [isOpen, setIsOpen] = useState(false);
  // Which theme to show the CSS file for, when the config has several themes
  const [chosenTheme, setChosenTheme] = useState(workspace.activeTheme);
  const cssThemeName = Object.hasOwn(themes, chosenTheme)
    ? chosenTheme
    : workspace.activeTheme;
  const themeCss = useThemeCss(cssThemeName, themes[cssThemeName], isOpen);

  /* The config file is the theme store's config as it is. A config made here gets the schema of this version. */
  const configJson = JSON.stringify(
    {
      $schema: `https://designsystemet.no/schemas/config/${pkg.version}.json`,
      ...workspace.config,
    },
    null,
    2,
  );

  return (
    <>
      <Button
        className={classes.trigger}
        aria-haspopup='dialog'
        onClick={() => {
          setIsOpen(true);
          setChosenTheme(workspace.activeTheme);
          modalRef.current?.showModal();
        }}
      >
        <StarIcon aria-hidden />
        {t('themeModal.use-theme')}
      </Button>
      <Dialog
        className={classes.modal}
        ref={modalRef}
        closedby='any'
        onClose={() => setIsOpen(false)}
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
          {/* Two ways to use the theme, side by side: a config file for the CLI, or the generated CSS file. */}
          <div className={classes.content}>
            <section className={classes.leftSection}>
              <Heading data-size='xs' level={3}>
                {t('themeModal.config.heading')}
              </Heading>
              <Paragraph>{t('themeModal.config.description')}</Paragraph>
              <Config
                configSnippet={configJson}
                buildSnippet={`npx @digdir/designsystemet${isProduction ? '@latest' : '@next'}`}
              />
            </section>
            <section className={classes.rightSection}>
              <Heading data-size='xs' level={3}>
                {t('themeModal.css.heading')}
              </Heading>
              <Paragraph>{t('themeModal.css.description')}</Paragraph>
              <Css
                themeName={cssThemeName}
                themeNames={Object.keys(themes)}
                onThemeChange={setChosenTheme}
                {...themeCss}
              />
            </section>
          </div>
        </Dialog.Block>
        <Dialog.Block>
          <div className={classes.contact}>
            <div className={classes.contact__icon}>
              <InformationSquareIcon
                aria-hidden='true'
                height='1.5rem'
                width='1.5rem'
              />
            </div>
            <div className={classes.contact__content}>
              <Heading data-size='2xs'>{t('themeModal.help-heading')}</Heading>
              <Paragraph data-size='sm'>
                {t('themeModal.help-description')}{' '}
                <Link target='_blank' href='https://designsystemet.no/slack'>
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
        </Dialog.Block>
      </Dialog>
    </>
  );
};
