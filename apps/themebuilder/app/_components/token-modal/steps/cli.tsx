import { Alert, Link, Paragraph, Switch } from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import classes from '../token-modal.module.css';

export default function Cli({
  buildSnippet,
  cliSnippet,
}: {
  buildSnippet: string;
  cliSnippet: {
    windows: string;
    unix: string;
  };
}) {
  const { t } = useTranslation();
  const { severityColors } = useThemebuilder();

  const [formatWin, setFormatWin] = useState(
    navigator.userAgent.includes('Windows'),
  );

  const severityHasChanged = severityColors
    .map((c) => c.isDefault)
    .includes(false);

  return (
    <>
      {severityHasChanged && (
        <Alert
          data-color='warning'
          style={{
            marginBottom: 'var(--ds-size-4)',
          }}
        >
          {t('themeModal.cli.severity-warning')}
        </Alert>
      )}
      <div className={classes.step}>
        <span>1</span>
        <Paragraph>
          {t('themeModal.cli.step-one')}{' '}
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
        <CodeBlock language='bash'>
          {formatWin ? cliSnippet.windows : cliSnippet.unix}
        </CodeBlock>
      </div>
      <div
        className={classes.step}
        style={{
          marginTop: 'var(--ds-size-4)',
        }}
      >
        <span>2</span>
        <Paragraph>{t('themeModal.cli.step-two')}</Paragraph>
      </div>
      <div className={classes.snippet}>
        <CodeBlock language='bash'>{buildSnippet}</CodeBlock>
      </div>
    </>
  );
}
