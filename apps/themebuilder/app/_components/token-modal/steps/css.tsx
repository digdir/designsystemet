import { Button, Paragraph } from '@digdir/designsystemet-react';
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
      {error && (
        <Paragraph data-color='danger'>{t('themeModal.css.error')}</Paragraph>
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
