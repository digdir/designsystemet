// biome-ignore-all lint/suspicious/noExplicitAny: we have not kept old schema for types, so we need to use any here
import { applyEdits, modify } from 'jsonc-parser';
import pc from 'picocolors';
import { parseJsonc } from '../schemas/helpers.ts';

const formattingOptions = { insertSpaces: true, tabSize: 2 } as const;

const flattenColors = (colors: any) => {
  const { main, support, neutral, ...restColors } = colors;
  return {
    ...restColors,
    ...main,
    ...support,
    neutral,
  };
};

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
  const currentConfig = parseJsonc<any>(config);

  if (!currentConfig.themes) {
    return false;
  }

  return Object.values(currentConfig.themes).some(isOldColorSchema);
};

const yes = (config: string): string => {
  const currentConfig = parseJsonc<any>(config);

  if (!currentConfig.themes) {
    return config;
  }

  // Apply targeted edits to the original text instead of re-serializing the whole
  // config, so comments, formatting and trailing commas outside the color blocks
  // are preserved. Each edit replaces only an affected theme's `colors` subtree.
  let text = config;
  for (const [themeName, theme] of Object.entries<any>(currentConfig.themes)) {
    if (isOldColorSchema(theme)) {
      const edits = modify(text, ['themes', themeName, 'colors'], flattenColors(theme.colors), { formattingOptions });
      text = applyEdits(text, edits);
    }
  }

  return text;
};

const migration: Automigrate = {
  name: 'Flatten color categories',
  check: isConfigWithOldColorSchema,
  message: `Your config file uses the old color schema with ${pc.yellow('main')} and ${pc.yellow('support')} categories.\nThis required migration will move all colors under a single ${pc.yellow('colors')} per theme.\n`,
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
