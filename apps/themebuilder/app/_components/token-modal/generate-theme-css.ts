import {
  configSchema,
  type ExternalConfigSchemaInput,
  externalConfigSchema,
  formatThemeCSS,
} from '@digdir/designsystemet/internal';

type ThemeConfig = ExternalConfigSchemaInput['themes'][string];

/**
 * Generates the CSS for a theme the same way the CLI does, by validating it like a config file and
 * running it through `formatThemeCSS`.
 */
export const generateThemeCss = async (name: string, themeConfig: ThemeConfig) => {
  // Validate against the public schema first, then fill in the internal defaults, like the CLI and Figma plugin.
  const externalConfig = externalConfigSchema.parse({
    themes: { [name]: themeConfig },
  });
  const config = configSchema.parse(externalConfig);

  const files = await formatThemeCSS(
    { name, ...config.themes[name] } as Parameters<typeof formatThemeCSS>[0],
    { verbose: false, tailwind: false },
  );

  return files.map((file) => file.output).join('\n');
};
