import { Button, Link, Paragraph } from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { DownloadIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ownThemeDocsUrl } from '~/_utils/docs-url';
import { downloadFile } from './download-file';
import classes from './export-theme-dialog.module.css';

const CONFIG_FILENAME = 'designsystemet.config.json';

export function ConfigFileSection({
  configSnippet,
  buildSnippet,
}: {
  configSnippet: string;
  buildSnippet: string;
}) {
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <>
      <div className={classes.step}>
        <span>1</span>
        <Paragraph>{t('exportTheme.config.step-one')} </Paragraph>
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
        {t('exportTheme.config.download', { filename: CONFIG_FILENAME })}
      </Button>
      <div className={classes.step}>
        <span>2</span>
        <Paragraph>{t('exportTheme.config.step-two')}</Paragraph>
      </div>
      <div className={classes.command}>
        <CodeBlock language='bash'>{buildSnippet}</CodeBlock>
        <Paragraph>
          {t('exportTheme.config.help')}{' '}
          <Link target='_blank' href={ownThemeDocsUrl(lang)}>
            {t('exportTheme.own-theme')}
          </Link>
        </Paragraph>
      </div>
    </>
  );
}
