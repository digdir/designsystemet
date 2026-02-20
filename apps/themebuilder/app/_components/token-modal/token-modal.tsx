import {
  Dialog,
  Divider,
  Field,
  Heading,
  Input,
  Label,
  Link,
  Paragraph,
  Tabs,
} from '@digdir/designsystemet-react';
import { InformationSquareIcon, StarIcon } from '@navikt/aksel-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Cli from './steps/cli';
import Config from './steps/config';
import classes from './token-modal.module.css';
import { useTokenModal } from './use-token-modal';

export const TokenModal = () => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDialogElement>(null);
  const { themeName, setThemeName, cliSnippet, buildSnippet, configSnippet } =
    useTokenModal();

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger
        className={classes.trigger}
        onClick={() => {
          return modalRef.current?.showModal();
        }}
      >
        <StarIcon aria-hidden width='1.5rem' height='auto' />
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
          <Field>
            <Heading className={classes.modalHeader} data-size='xs' level={3}>
              <Label>{t('themeModal.theme-name')}</Label>
            </Heading>
            <Field.Description>
              {t('themeModal.theme-name-description')}
            </Field.Description>
            <Input
              name='themeName'
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
          <div className={classes.content}>
            <div className={classes.rightSection}>
              <Tabs defaultValue='config'>
                <Tabs.List>
                  <Tabs.Tab value='config'>Config File</Tabs.Tab>
                  <Tabs.Tab value='cli'>CLI</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value='cli' className={classes.tabpanel}>
                  <Cli
                    cliSnippet={cliSnippet}
                    buildSnippet={buildSnippet.cli}
                  />
                </Tabs.Panel>
                <Tabs.Panel value='config' className={classes.tabpanel}>
                  <Config
                    configSnippet={configSnippet}
                    buildSnippet={buildSnippet.config}
                  />
                </Tabs.Panel>
              </Tabs>
              <Divider />
              <div className={classes.contact}>
                <div className={classes.contact__icon}>
                  <InformationSquareIcon
                    aria-hidden='true'
                    height='1.5rem'
                    width='1.5rem'
                  />
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
