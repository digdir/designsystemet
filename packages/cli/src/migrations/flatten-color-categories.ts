// biome-ignore-all lint/suspicious/noExplicitAny: we have not kept old schema for types, so we need to use any here
import pc from 'picocolors';

type Automigrate = {
  name: string;
  isEligible: (config: any) => boolean;
  logMessage: string;
  migrate: (config: string) => string;
};

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

export default {
  name: 'Flatten color categories',
  isEligible: isConfigWithOldColorSchema,
  logMessage: `Config file is using the old color schema with ${pc.yellow('main')} and ${pc.yellow('support')} categories.\nThis migration will flatten all colors into a single "colors" category per theme.\n`,
  migrate: (config: string): string => {
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
        }
      }
    }
    const migratedConfig = {
      ...currentConfig,
      themes: updatedThemes,
    };

    return JSON.stringify(migratedConfig, null, 2);
  },
} as Automigrate;
