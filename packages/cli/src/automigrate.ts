import confirm from '@inquirer/confirm';
import pc from 'picocolors';
import { dsfs } from '../src/utils/filesystem.js';
import { automigrations } from './migrations/index.js';

export const checkAutomigrate = async (configFile: string, configFilePath: string) => {
  let migratedConfigFile = null;
  for (const migration of Object.values(automigrations)) {
    if (!migration.isEligible(configFile)) {
      continue;
    }

    console.log(pc.red(`\n ✋ Automigration detected \n`));
    console.log(
      pc.yellow(`Config file ${pc.blue(configFilePath)} is eligible for migration: ${pc.blue(migration.name)}\n`),
    );
    console.log(`${migration.logMessage}`);
    const answer = await confirm({
      message: `Do you want to migrate?`,
    });

    if (!answer) {
      console.log(pc.yellow('Migration cancelled by user. Using existing config file without changes.'));
      migratedConfigFile = configFile;
    } else {
      migratedConfigFile = migration.migrate(configFile);
      if (migratedConfigFile) {
        dsfs.writeFile(configFilePath, migratedConfigFile);
        console.log(pc.green(`Config file successfully migrated!`));
      }
    }
  }
  return migratedConfigFile;
};
