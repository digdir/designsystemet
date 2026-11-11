import {
  Button,
  Field,
  Paragraph,
  Select,
  Skeleton,
} from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { DownloadIcon } from '@navikt/aksel-icons';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { downloadFile } from '../download-file';
import classes from '../token-modal.module.css';

export default function Css({
  themeName,
  css,
  isGenerating,
  error,
  hasMultipleThemes,
  cssTheme,
  themeNames,
  setCssThemeName,
}: {
  themeName: string;
  css: string;
  isGenerating: boolean;
  error: Error | null;
  cssTheme: { name: string };
  themeNames: string[];
  setCssThemeName: (name: string) => void;
  hasMultipleThemes: boolean;
}) {
  const { t } = useTranslation();
  const filename = `${themeName}.css`;

  return (
    <>
      {hasMultipleThemes && (
        <Field data-size='sm'>
          {/** biome-ignore lint/a11y/noLabelWithoutControl: field adds this */}
          <label className={clsx(classes.step, 'ds-paragraph')}>
            <span>1</span>
            {t('themeModal.css.select-theme')}
          </label>
          <Select
            value={cssTheme.name}
            onChange={(event) => setCssThemeName(event.currentTarget.value)}
            style={{
              marginBlockStart: 'var(--ds-size-4)',
            }}
          >
            {themeNames.map((name) => (
              <Select.Option key={name} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Field>
      )}
      <div className={classes.step}>
        <span>{hasMultipleThemes ? 2 : 1}</span>
        <Paragraph>{t('themeModal.css.step-one', { filename })}</Paragraph>
      </div>
      {error ? (
        <Paragraph data-color='danger'>{t('themeModal.css.error')}</Paragraph>
      ) : (
        <div className={classes.snippet} aria-busy={isGenerating}>
          {isGenerating && <Skeleton className={classes['snippet-skeleton']} />}
          {/* The generated CSS is already formatted, and prettifying a whole theme is slow. */}
          <CodeBlock language='css' prettify={false}>
            {css}
          </CodeBlock>
        </div>
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
