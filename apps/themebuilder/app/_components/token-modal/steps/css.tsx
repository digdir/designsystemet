import { Button, Paragraph, Spinner } from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { DownloadIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { downloadFile } from '../download-file';
import classes from '../token-modal.module.css';

export default function Css({
  themeName,
  css,
  isGenerating,
  error,
}: {
  themeName: string;
  css: string;
  isGenerating: boolean;
  error: Error | null;
}) {
  const { t } = useTranslation();
  const filename = `${themeName}.css`;

  return (
    <>
      <div className={classes.step}>
        <span>1</span>
        <Paragraph>{t('themeModal.css.step-one', { filename })}</Paragraph>
      </div>
      {error ? (
        <Paragraph data-color='danger'>{t('themeModal.css.error')}</Paragraph>
      ) : css ? (
        <div className={`${classes.snippet} ${classes['snippet-themecss']}`}>
          <CodeBlock language='css'>{css}</CodeBlock>
        </div>
      ) : (
        <Spinner aria-label={t('themeModal.generating-css')} />
      )}
      <Button
        variant='secondary'
        disabled={!css || isGenerating}
        onClick={() => downloadFile(filename, css, 'text/css')}
      >
        <DownloadIcon aria-hidden />
        {isGenerating
          ? t('themeModal.generating-css')
          : t('themeModal.css.download', { filename })}
      </Button>
    </>
  );
}
