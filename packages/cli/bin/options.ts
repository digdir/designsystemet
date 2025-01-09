import type { Command, OptionValueSource, OptionValues } from '@commander-js/extra-typings';

const getOptionIfMatchingSource =
  (...sources: OptionValueSource[]) =>
  <Args extends unknown[], Opts extends OptionValues, K extends keyof Opts>(
    command: Command<Args, Opts>,
    option: K,
  ) => {
    const source = command.getOptionValueSource(option);
    console.log(sources, source);
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
 * This function is basically the default behaviour, unlike {@link getExplicitOptionOnly}.
 * It is provided so that the program can choose its behaviour as needed.
 */
export const getExplicitOrDefaultOption = getOptionIfMatchingSource('cli', 'default');
