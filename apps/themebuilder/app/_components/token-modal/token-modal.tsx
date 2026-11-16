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
import Config from './steps/config';
import Css from './steps/css';
import classes from './token-modal.module.css';
import { useThemeCss } from './use-theme-css';
import { useTokenModal } from './use-token-modal';

export const TokenModal = () => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDialogElement>(null);
  const { themeName, buildSnippet, configSnippet, themes } = useTokenModal();
  // Generating the CSS takes a moment, so only do it while the modal is open.
  const [isOpen, setIsOpen] = useState(false);
  const themeNames = Object.keys(themes);
  const hasMultipleThemes = themeNames.length > 1;
  // Which theme to show the CSS file for, when the config has several themes
  const [cssThemeName, setCssThemeName] = useState(themeName);
  const selectedThemeName =
    hasMultipleThemes && Object.hasOwn(themes, cssThemeName)
      ? cssThemeName
      : themeName;
  const cssTheme = {
    name: selectedThemeName,
    config: themes[selectedThemeName],
  };
  const themeCss = useThemeCss(cssTheme.name, cssTheme.config, isOpen);

  return (
    <>
      <Button
        className={classes.trigger}
        aria-haspopup='dialog'
        onClick={() => {
          setIsOpen(true);
          setCssThemeName(themeName);
          return modalRef.current?.showModal();
        }}
      >
        <StarIcon aria-hidden height='auto' />
        {t('themeModal.use-theme')}
      </Button>
      <Dialog
        className={classes.modal}
        style={{ maxWidth: 1200 }}
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
                configSnippet={configSnippet}
                buildSnippet={buildSnippet.config}
              />
            </section>
            <section className={classes.rightSection}>
              <Heading data-size='xs' level={3}>
                {t('themeModal.css.heading')}
              </Heading>
              <Paragraph>{t('themeModal.css.description')}</Paragraph>
              <Css
                themeName={cssTheme.name}
                hasMultipleThemes={hasMultipleThemes}
                cssTheme={cssTheme}
                themeNames={themeNames}
                setCssThemeName={setCssThemeName}
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
