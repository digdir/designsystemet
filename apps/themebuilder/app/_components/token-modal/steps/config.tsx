import { Button, Link, Paragraph } from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { DownloadIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import { downloadFile } from '../download-file';
import classes from '../token-modal.module.css';

const CONFIG_FILENAME = 'designsystemet.config.json';

export default function Config({
  configSnippet,
  buildSnippet,
}: {
  configSnippet: string;
  buildSnippet: string;
}) {
  const { t } = useTranslation();
  const { lang } = useRouteLoaderData('themebuilder');

  return (
    <>
      <div className={classes.step}>
        <span>1</span>
        <Paragraph>{t('themeModal.config.step-one')} </Paragraph>
      </div>
      <div className={classes.snippet}>
        <CodeBlock language='json'>{configSnippet}</CodeBlock>
      </div>
      <Button
        variant='secondary'
        onClick={() =>
          downloadFile(CONFIG_FILENAME, configSnippet, 'application/json')
        }
      >
        <DownloadIcon aria-hidden />
        {t('themeModal.config.download', { filename: CONFIG_FILENAME })}
      </Button>
      <div
        className={classes.step}
        style={{
          marginTop: 'var(--ds-size-4)',
        }}
      >
        <span>2</span>
        <Paragraph>{t('themeModal.config.step-two')}</Paragraph>
      </div>
      <div className={classes.command}>
        <CodeBlock language='bash'>{buildSnippet}</CodeBlock>
        <Paragraph>
          {t('themeModal.config.help')}{' '}
          <Link
            target='_blank'
            href={`https://www.designsystemet.no/${t(lang)}/fundamentals/start-here/own-theme`}
          >
            {t('themeModal.own-theme')}
          </Link>
        </Paragraph>
      </div>
    </>
  );
}
