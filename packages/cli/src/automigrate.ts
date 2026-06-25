import confirm from '@inquirer/confirm';
import pc from 'picocolors';
import { dsfs } from '../src/utils/filesystem.js';
import { automigrations } from './migrations/index.js';

export const checkAutomigrate = async (configFile: string, configFilePath: string, yes: boolean) => {
  if (!configFile) {
    return null;
  }
  let migratedConfigFile = null;
  const eligibleMigrations = Object.values(automigrations).filter((migration) => {
    try {
      return migration.check(configFile);
    } catch {
      return false;
    }
  });
  if (eligibleMigrations.length === 0) {
    return null;
  }

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
      migratedConfigFile = migration.no(migratedConfigFile ?? configFile);
    } else {
      migratedConfigFile = migration.yes(migratedConfigFile ?? configFile);
      await dsfs.writeFile(configFilePath, migratedConfigFile);
    }
  }
  return migratedConfigFile;
};
