// biome-ignore-all lint/suspicious/noExplicitAny: we have not kept old schema for types, so we need to use any here
import {
  type ExternalConfigSchemaInput as ConfigSchema,
  externalConfigSchema as configSchema,
} from '@digdir/designsystemet/internal';
import {
  Button,
  Field,
  Label,
  Paragraph,
  Textarea,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { PencilIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { type WorkspaceConfig, workspaceToUrl } from '~/_utils/theme-workspace';
import classes from './config-paste.module.css';

export function ConfigPaste() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [configText, setConfigText] = useState('');
  const [validatedConfig, setValidatedConfig] =
    useState<WorkspaceConfig | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleValidate = () => {
    setErrors([]);
    setValidatedConfig(null);

    if (!configText.trim()) {
      setErrors([t('configPaste.validation-error')]);
      return;
    }

    try {
      const parsed = isConfigWithOldColorSchema(configText)
        ? migrateConfigWithOldColorSchema(configText)
        : JSON.parse(configText);

      const result = configSchema.safeParse(parsed);
      if (!result.success) {
        setErrors(
          result.error.issues.map((issue) =>
            issue.path.length > 0
              ? `${issue.path.join('.')}: ${issue.message}`
              : issue.message,
          ),
        );
        return;
      }
      const validated: ConfigSchema = parsed;

      if (!validated.themes || Object.keys(validated.themes).length === 0) {
        setErrors([t('configPaste.no-themes')]);
        return;
      }
      setValidatedConfig({ ...validated, themes: validated.themes });
    } catch (err) {
      console.error('Config validation error:', err);
      setErrors([
        err instanceof Error ? err.message : t('configPaste.validation-error'),
      ]);
    }
  };

  const themes = validatedConfig ? Object.entries(validatedConfig.themes) : [];

  return (
    <div className={classes.container}>
      <div className={classes.textareaWrapper}>
        <Field>
          <Label>{t('configPaste.title')}</Label>
          <Field.Description>{t('configPaste.description')}</Field.Description>
          <Textarea
            className={classes.textarea}
            value={configText}
            onChange={(e) => setConfigText(e.target.value)}
            placeholder={t('configPaste.placeholder')}
            rows={15}
            aria-invalid={errors.length > 0 || undefined}
            autoFocus
            suppressHydrationWarning
          />
          {errors.map((message) => (
            <ValidationMessage key={message} lang='en'>
              {message}
            </ValidationMessage>
          ))}
        </Field>
      </div>

      <div className={classes.actions}>
        <Button onClick={handleValidate} data-color='accent' data-size='sm'>
          {t('configPaste.validate')}
        </Button>
        {configText && (
          <Button
            onClick={(event) => {
              setConfigText('');
              setValidatedConfig(null);
              setErrors([]);
              event.currentTarget.closest('dialog')?.close();
            }}
            variant='secondary'
            data-size='sm'
          >
            {t('colorPane.cancel')}
          </Button>
        )}
      </div>

      {validatedConfig && themes.length > 0 && (
        <>
          <ValidationMessage data-color='success' role='status'>
            {t('configPaste.validation-success')}
          </ValidationMessage>
          <div>
            <Paragraph
              style={{ fontWeight: 500, marginBottom: 'var(--ds-size-2)' }}
            >
              {t('configPaste.select-theme')}
            </Paragraph>
            <div className={classes.themeList}>
              {themes.map(([themeName, themeConfig]) => (
                <div key={themeName} className={classes.themeItem}>
                  <div>
                    <Paragraph className={classes.themeName}>
                      {themeName}
                    </Paragraph>
                    <div className={classes.colorPreview}>
                      {themeConfig.colors &&
                        Object.values(themeConfig.colors)
                          .slice(0, 7)
                          .map((color, idx) => (
                            <div
                              key={idx}
                              className={classes.colorDot}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                    </div>
                  </div>
                  <Button
                    asChild
                    data-size='sm'
                    variant='secondary'
                    aria-label={`${t('configPaste.edit-theme')} ${themeName}`}
                  >
                    <Link
                      to={workspaceToUrl(
                        validatedConfig,
                        themeName,
                        lang || 'no',
                      )}
                      onClick={(event) => {
                        event.currentTarget.closest('dialog')?.close();
                      }}
                    >
                      <PencilIcon aria-hidden='true' />
                      {t('configPaste.edit-theme')}
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Temporary migration functions for old color schema, to be removed in future versions
const isOldColorSchema = (theme: any): boolean => {
  return (
    theme.colors &&
    Object.keys(theme.colors).length === 3 &&
    theme.colors.main &&
    theme.colors.support &&
    theme.colors.neutral
  );
};

const isConfigWithOldColorSchema = (config: any): boolean => {
  const currentConfig = JSON.parse(config);

  if (!currentConfig.themes) {
    return false;
  }

  return Object.values(currentConfig.themes).some(isOldColorSchema);
};

const migrateConfigWithOldColorSchema = (config: string): string => {
  const currentConfig = JSON.parse(config);
  const updatedThemes: Record<string, any> = {};

  if (currentConfig.themes) {
    for (const [themeName, _] of Object.entries(currentConfig.themes)) {
      const theme = currentConfig.themes[themeName];

      if (isOldColorSchema(theme)) {
        const { main, support, neutral, ...restColors } = theme.colors;

        const updatedTheme = {
          ...theme,
          colors: {
            ...restColors,
            ...main,
            ...support,
            neutral,
          },
        };

        updatedThemes[themeName] = updatedTheme;
      } else {
        updatedThemes[themeName] = theme;
      }
    }
  }
  const migratedConfig = {
    ...currentConfig,
    themes: updatedThemes,
  };

  return migratedConfig;
};
