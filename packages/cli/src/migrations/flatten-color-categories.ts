// biome-ignore-all lint/suspicious/noExplicitAny: we have not kept old schema for types, so we need to use any here
import pc from 'picocolors';

type Automigrate = {
  name: string;
  check: (config: any) => boolean;
  message: string;
  yes: (config: string) => string;
  no: (config: string) => string;
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

const yes = (config: string): string => {
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

  return JSON.stringify(migratedConfig, null, 2).concat('\n');
};

const migration: Automigrate = {
  name: 'Flatten color categories',
  check: isConfigWithOldColorSchema,
  message: `Config file is using the old color schema with ${pc.yellow('main')} and ${pc.yellow('support')} categories.\nThis migration will flatten all colors under ${pc.yellow('colors')} per theme.\n`,
  yes: (config: string): string => {
    const migratedConfig = yes(config);
    console.log(pc.green(`\nConfig file successfully migrated.`));

    return migratedConfig;
  },
  no: (config: string): string => {
    // We still want to flatten the config file even if the user chooses not to migrate, as we need to maintain compatibility with the new schema. However, we won't write the migrated config back to the file system.
    const migratedConfig = yes(config);
    console.log(pc.yellow('\nUsing existing config file but migration was skipped.\n'));
    return migratedConfig;
  },
};

export default migration;
