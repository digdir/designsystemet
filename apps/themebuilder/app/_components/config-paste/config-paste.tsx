// biome-ignore-all lint/suspicious/noExplicitAny: we have not kept old schema for types, so we need to use any here
import { type ConfigSchema, configSchema } from '@digdir/designsystemet';
import {
  Button,
  Paragraph,
  Textfield,
  ValidationMessage,
} from '@digdir/designsystemet-react';
import { PencilIcon } from '@navikt/aksel-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { configThemeToUrl } from '~/_utils/config-to-url';
import classes from './config-paste.module.css';

export function ConfigPaste() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [configText, setConfigText] = useState('');
  const [validatedConfig, setValidatedConfig] = useState<ConfigSchema | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleValidate = () => {
    setError(null);
    setValidatedConfig(null);

    if (!configText.trim()) {
      setError(t('configPaste.validation-error'));
      return;
    }

    try {
      const parsed = isConfigWithOldColorSchema(configText)
        ? migrateConfigWithOldColorSchema(configText)
        : JSON.parse(configText);

      const validated = configSchema.parse(parsed);
      setValidatedConfig(validated);

      if (!validated.themes || Object.keys(validated.themes).length === 0) {
        setError(t('configPaste.no-themes'));
        setValidatedConfig(null);
      }
    } catch (err) {
      console.error('Config validation error:', err);
      setError(
        err instanceof Error ? err.message : t('configPaste.validation-error'),
      );
    }
  };

  const themes = validatedConfig?.themes
    ? Object.entries(validatedConfig.themes)
    : [];

  return (
    <div className={classes.container}>
      <div className={classes.textareaWrapper}>
        <Textfield
          multiline
          label={t('configPaste.title')}
          description={t('configPaste.description')}
          className={classes.textarea}
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          placeholder={t('configPaste.placeholder')}
          rows={15}
          error={error ? error : undefined}
          autoFocus
        />
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
              setError(null);
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
          <ValidationMessage data-color='success'>
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
                    <Link to={configThemeToUrl(themeConfig, lang || 'no')}>
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
