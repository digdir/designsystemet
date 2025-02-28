import type { Command, OptionValueSource, OptionValues } from '@commander-js/extra-typings';

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

export type OptionGetter = ReturnType<typeof getOptionIfMatchingSource>;

/**
 * Get an option value if it is explicitly supplied to the CLI command.
 * The difference between this and using the option directly is that we return undefined
 * instead of the default value if the option was not explicitly set.
 */
export const getExplicitOptionOnly = getOptionIfMatchingSource('cli');

/**
 * Get the default value specified for a CLI command option.
 * Mostly useful for getting values which may later be overridden.
 */
export const getDefaultOptionOnly = getOptionIfMatchingSource('default');

/**
 * This function is basically the default behaviour, unlike {@link getExplicitOptionOnly}.
 * It is provided so that the program can choose its behaviour as needed.
 */
export const getDefaultOrExplicitOption = getOptionIfMatchingSource('cli', 'default');
