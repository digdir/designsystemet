/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: it wants the spans with aria-label to have a role */
import {
  Dialog,
  Divider,
  Heading,
  Input,
  Link,
  Paragraph,
  Switch,
  Tabs,
} from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { InformationSquareIcon, StarIcon } from '@navikt/aksel-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './token-modal.module.css';
import { useTokenModal } from './use-token-modal';

export const TokenModal = () => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDialogElement>(null);
  const {
    themeName,
    setThemeName,
    formatWin,
    setFormatWin,
    cliSnippet,
    buildSnippet,
    configSnippet,
  } = useTokenModal();

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
              <Tabs defaultValue='config'>
                <Tabs.List>
                  <Tabs.Tab value='config'>Config File</Tabs.Tab>
                  <Tabs.Tab value='cli'>CLI</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value='cli' className={classes.tabpanel}>
                  <div className={classes.step}>
                    <span
                      className={classes.stepLabel}
                      aria-label={t('themeModal.step-aria', {
                        step: '1',
                        totalSteps: '2',
                      })}
                    >
                      1
                    </span>
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
                        href='https://www.designsystemet.no/no/fundamentals/themebuilder/own-theme'
                      >
                        {t('themeModal.own-theme')}
                      </Link>{' '}
                      {t('themeModal.page')}
                    </Paragraph>
                  </div>
                  <div className={classes.snippet}>
                    <Switch
                      style={{
                        marginInlineStart: 'auto',
                        width: 'fit-content',
                      }}
                      position='end'
                      label={t('themeModal.format')}
                      checked={formatWin}
                      onChange={(e) => {
                        setFormatWin(e.currentTarget.checked);
                      }}
                    />
                    <CodeBlock language='bash'>{cliSnippet}</CodeBlock>
                  </div>
                </Tabs.Panel>
                <Tabs.Panel value='config' className={classes.tabpanel}>
                  <div className={classes.step}>
                    <span
                      className={classes.stepLabel}
                      aria-label={t('themeModal.step-aria', {
                        step: '2',
                        totalSteps: '2',
                      })}
                    >
                      1
                    </span>
                    <Paragraph>{t('themeModal.use-config-file')}</Paragraph>
                  </div>
                  <div className={classes.snippet}>
                    <CodeBlock language='json'>{configSnippet}</CodeBlock>
                  </div>
                </Tabs.Panel>
              </Tabs>
              <div
                className={classes.step}
                style={{
                  marginTop: 'var(--ds-size-4)',
                }}
              >
                <span
                  className={classes.stepLabel}
                  aria-label={t('themeModal.step-aria', {
                    step: '2',
                    totalSteps: '2',
                  })}
                >
                  2
                </span>
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
