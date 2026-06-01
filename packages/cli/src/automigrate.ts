import confirm from '@inquirer/confirm';
import pc from 'picocolors';
import { dsfs } from '../src/utils/filesystem.js';
import { automigrations } from './migrations/index.js';

export const checkAutomigrate = async (configFile: string, configFilePath: string, yes: boolean) => {
  let migratedConfigFile = null;
  const eligbleMigrations = Object.values(automigrations).filter((migration) => migration.check(configFile));

  if (eligbleMigrations.length === 0) {
    return null;
  }

  for (const migration of eligbleMigrations) {
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
      migratedConfigFile = migration.no(configFile);
    } else {
      migratedConfigFile = migration.yes(configFile);
      await dsfs.writeFile(configFilePath, migratedConfigFile);
    }
  }
  return migratedConfigFile;
};
