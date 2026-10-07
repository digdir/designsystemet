import {
  Dialog,
  Field,
  Heading,
  Input,
  Label,
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
  const {
    themeName,
    setThemeName,
    buildSnippet,
    configSnippet,
    isWorkspace,
    themeConfig,
  } = useTokenModal();
  // Generating the CSS takes a moment, so only do it while the modal is open.
  const [isOpen, setIsOpen] = useState(false);
  const themeCss = useThemeCss(themeName, themeConfig, isOpen);

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger
        className={classes.trigger}
        onClick={() => {
          setIsOpen(true);
          return modalRef.current?.showModal();
        }}
      >
        <StarIcon aria-hidden height='auto' />
        {t('themeModal.use-theme')}
      </Dialog.Trigger>
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
          <Field>
            <Heading className={classes.modalHeader} data-size='xs' level={3}>
              <Label>{t('themeModal.theme-name')}</Label>
            </Heading>
            {!isWorkspace && (
              <Field.Description>
                {t('themeModal.theme-name-description')}
              </Field.Description>
            )}
            <Input
              name='themeName'
              readOnly={isWorkspace}
              value={themeName}
              onChange={(e) => {
                const value = e.currentTarget.value
                  .replace(/\s+/g, '-')
                  .replace(/[^A-Z0-9-]+/gi, '')
                  .toLowerCase();

                setThemeName(value);
              }}
            />
          </Field>
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
              <Css themeName={themeName} {...themeCss} />
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
    </Dialog.TriggerContext>
  );
};
