import { type Command, Option, type OptionValueSource, type OptionValues } from '@commander-js/extra-typings';
import { DEFAULT_CONFIG_FILEPATHS } from './config.ts';

const getOptionIfMatchingSource =
  (...sources: OptionValueSource[]) =>
  <Args extends unknown[], Opts extends OptionValues, K extends keyof Opts>(
    command: Command<Args, Opts>,
    option: K,
  ) => {
    const source = command.getOptionValueSource(option);
    if (sources.includes(source)) {
      return command.getOptionValue(option);
    }
  };

/**
 * Try to get the explicitly supplied CLI option, and fall back to the default value
 * for the option as defined in the {@link Command}
 */
export const getCliOption = getOptionIfMatchingSource('cli', 'default');

export const configOption = () =>
  new Option(
    '-c, --config <filename>',
    `Path to config file (auto-detects ${DEFAULT_CONFIG_FILEPATHS.map((p) => `"${p}"`).join(' or ')})`,
  );
export const dryOption = (description = 'Dry run - no files will be written') =>
  new Option('--dry [boolean]', description).argParser(parseBoolean).default(false);
export const verboseOption = () => new Option('--verbose', 'Enable verbose output').default(false);

export function parseBoolean(value: string | boolean): boolean {
  return value === 'true' || value === true;
}
