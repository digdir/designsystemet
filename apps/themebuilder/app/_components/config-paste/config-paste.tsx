import {
  Button,
  Dialog,
  Field,
  Heading,
  Label,
  Paragraph,
  Textarea,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { PencilIcon } from '@navikt/aksel-icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ImportedConfig, importConfig } from '~/model/import-config';
import { useThemeStore } from '~/model/theme-store';
import classes from './config-paste.module.css';

/** A button that opens a dialog where a config file is pasted, checked and opened in the theme builder */
export function ConfigPaste() {
  const { t } = useTranslation();
  const { setWorkspace } = useThemeStore();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [configText, setConfigText] = useState('');
  /* The result of the last validation, until the text is changed */
  const [result, setResult] = useState<ImportedConfig | null>(null);

  const config = result && 'config' in result ? result.config : null;
  const errors =
    !result || 'config' in result
      ? []
      : result.error === 'invalid'
        ? result.messages
        : [
            t(
              result.error === 'no-themes'
                ? 'configPaste.no-themes'
                : 'configPaste.validation-error',
            ),
          ];

  const close = () => {
    setConfigText('');
    setResult(null);
    dialogRef.current?.close();
  };

  return (
    <>
      <Button
        variant='secondary'
        className={classes.trigger}
        aria-haspopup='dialog'
        onClick={() => dialogRef.current?.showModal()}
      >
        {t('configPaste.import-config')}
      </Button>
      {/* The size is set since the button sits among small buttons, and the dialog would inherit their size */}
      <Dialog
        ref={dialogRef}
        closedby='any'
        className={classes.dialog}
        data-size='md'
      >
        <Dialog.Block>
          <Heading level={2}>{t('configPaste.import-config')}</Heading>
        </Dialog.Block>
        <Dialog.Block>
          <div className={classes.container}>
            <div className={classes.textareaWrapper}>
              <Field>
                <Label>{t('configPaste.title')}</Label>
                <Field.Description>
                  {t('configPaste.description')}
                </Field.Description>
                <Textarea
                  className={classes.textarea}
                  value={configText}
                  onChange={(e) => {
                    setConfigText(e.target.value);
                    // What was validated is no longer what is in the field
                    setResult(null);
                  }}
                  placeholder={t('configPaste.placeholder')}
                  rows={15}
                  aria-invalid={errors.length > 0 || undefined}
                  suppressHydrationWarning
                />
                <ul lang='en'>
                  {errors.map((message) => (
                    <ValidationMessage key={message} asChild>
                      <li>{message}</li>
                    </ValidationMessage>
                  ))}
                </ul>
              </Field>
            </div>

            <div className={classes.actions}>
              <Button
                onClick={() => setResult(importConfig(configText))}
                data-color='accent'
                data-size='sm'
              >
                {t('configPaste.validate')}
              </Button>
              {configText && (
                <Button onClick={close} variant='secondary' data-size='sm'>
                  {t('colorPane.cancel')}
                </Button>
              )}
            </div>

            {config && (
              <>
                <ValidationMessage data-color='success' role='status'>
                  {t('configPaste.validation-success')}
                </ValidationMessage>
                <div>
                  <Paragraph className={classes.selectTheme}>
                    {t('configPaste.select-theme')}
                  </Paragraph>
                  <div className={classes.themeList}>
                    {Object.entries(config.themes).map(
                      ([themeName, themeConfig]) => (
                        <div key={themeName} className={classes.themeItem}>
                          <div>
                            <Paragraph className={classes.themeName}>
                              {themeName}
                            </Paragraph>
                            <div className={classes.colorPreview}>
                              {Object.entries(themeConfig.colors)
                                .slice(0, 7)
                                .map(([name, color]) => (
                                  <div
                                    key={name}
                                    className={classes.colorDot}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                            </div>
                          </div>
                          <Button
                            data-size='sm'
                            variant='secondary'
                            aria-label={`${t('configPaste.edit-theme')} ${themeName}`}
                            onClick={() => {
                              setWorkspace({ config, activeTheme: themeName });
                              close();
                            }}
                          >
                            <PencilIcon aria-hidden='true' />
                            {t('configPaste.edit-theme')}
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </Dialog.Block>
      </Dialog>
    </>
  );
}
