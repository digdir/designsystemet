import {
  Button,
  Field,
  Paragraph,
  Select,
  Skeleton,
} from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { DownloadIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { downloadFile } from './download-file';
import classes from './export-theme-dialog.module.css';

export function CssFileSection({
  themeName,
  themeNames,
  onThemeChange,
  css,
  isGenerating,
  error,
}: {
  /** The theme the CSS is for */
  themeName: string;
  /** The themes to choose between. The choice is only shown when there are several. */
  themeNames: string[];
  onThemeChange: (name: string) => void;
  css: string;
  isGenerating: boolean;
  error: Error | null;
}) {
  const { t } = useTranslation();
  const filename = `${themeName}.css`;
  const hasMultipleThemes = themeNames.length > 1;

  return (
    <>
      {hasMultipleThemes && (
        <Field data-size='sm'>
          {/** biome-ignore lint/a11y/noLabelWithoutControl: field adds this */}
          <label className={cl(classes.step, 'ds-paragraph')}>
            <span>1</span>
            {t('exportTheme.css.select-theme')}
          </label>
          <Select
            value={themeName}
            onChange={(event) => onThemeChange(event.currentTarget.value)}
            className={classes.themeSelect}
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
        <Paragraph>{t('exportTheme.css.step-one')}</Paragraph>
      </div>
      {error ? (
        <Paragraph data-color='danger'>{t('exportTheme.css.error')}</Paragraph>
      ) : (
        <div className={classes.snippet} aria-busy={isGenerating}>
          {isGenerating && <Skeleton className={classes.snippetSkeleton} />}
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
          ? t('exportTheme.generating-css')
          : t('exportTheme.css.download', { filename })}
      </Button>
    </>
  );
}
