import confirm from '@inquirer/confirm';
import pc from 'picocolors';
import { automigrations } from './migrations/index.ts';
import { dsfs } from './utils/filesystem.ts';

export const checkAutomigrate = async (configFile: string, configFilePath: string, yes: boolean) => {
  const eligibleMigrations = Object.values(automigrations).filter((migration) => {
    try {
      return migration.check(configFile);
    } catch {
      return false;
    }
  });
  if (eligibleMigrations.length === 0) {
    return configFile;
  }

  // Declined migrations may still transform the config for this run, e.g. to keep it compatible with the schema.
  // Those changes must never reach the file, so the text written to disk is tracked separately from the text used now.
  let persistedConfig = configFile;
  let runtimeConfig = configFile;
  for (const migration of eligibleMigrations) {
    console.log(pc.red(`\n ✋ Automigration detected \n`));
    console.log(
      pc.yellow(`Config file ${pc.blue(configFilePath)} is eligible for migration: ${pc.blue(migration.name)}\n`),
    );
    console.log(`${migration.message}`);
    let answer = true;

    if (!yes) {
      answer = await confirm({
        message: `Do you want to migrate?`,
      });
    } else {
      console.log(pc.green(`Auto-confirming migration with --yes flag`));
    }

    if (!answer) {
      runtimeConfig = migration.no(runtimeConfig);
    } else {
      const migrated = migration.yes(persistedConfig, { configFilePath });
      // Only migrate the runtime text separately when a declined migration has made it differ from the file.
      runtimeConfig = runtimeConfig === persistedConfig ? migrated : migration.yes(runtimeConfig, { configFilePath });
      persistedConfig = migrated;
      await dsfs.writeFile(configFilePath, persistedConfig);
    }
  }
  return runtimeConfig;
};
