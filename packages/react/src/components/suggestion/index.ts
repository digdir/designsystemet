import { Suggestion as SuggestionRoot } from './suggestion';
import { SuggestionClear } from './suggestion-clear';
import { SuggestionEmpty } from './suggestion-empty';
import { SuggestionInput } from './suggestion-input';
import { SuggestionList } from './suggestion-list';
import { SuggestionOption } from './suggestion-option';
import { SuggestionToggle } from './suggestion-toggle';

type Suggestion = typeof SuggestionRoot & {
  /**
   * Component that provides a Suggestion list.
   *
   * Place as a descendant of `Suggestion`
   *
   * @example
   * <Suggestion>
   *   <Suggestion.Input />
   *   <Suggestion.Toggle />
   *   <Suggestion.Clear />
   *   <Suggestion.List />
   * </Suggestion>
   */
  List: typeof SuggestionList;
  /**
   * Component that provides an input field for the Suggestion list.
   *
   * Place as a descendant of `Suggestion`
   *
   * @example
   * <Suggestion>
   *   <Suggestion.Input />
   *   <Suggestion.Toggle />
   *   <Suggestion.Clear />
   *   <Suggestion.List />
   * </Suggestion>
   */
  Input: typeof SuggestionInput;
  /**
   * Component that provides an empty Suggestion list.
   *
   * Place as a descendant of `Suggestion.List`
   *
   * @example
   * <Suggestion.List>
   *   <Suggestion.Empty>Tomt</Suggestion.Empty>
   * </Suggestion.List>
   */
  Empty: typeof SuggestionEmpty;
  /**
   * A component for rendering individual options in the Suggestion list.
   *
   * @example
   * <Suggestion>
   *   <Suggestion.Input />
   *   <Suggestion.Toggle />
   *   <Suggestion.Clear />
   *   <Suggestion.List>
   *     <Suggestion.Option value='Option 1'>Option 1</Suggestion.Option>
   *     <Suggestion.Option value='Option 2'>Option 2</Suggestion.Option>
   *   </Suggestion.List>
   * </Suggestion>
   */
  Option: typeof SuggestionOption;
  /**
   * Component that provides a clear button for the Suggestion input.
   *
   * Place as a descendant of `Suggestion`
   *
   * @example
   * <Suggestion>
   *   <Suggestion.Input />
   *   <Suggestion.Toggle />
   *   <Suggestion.Clear />
   *   <Suggestion.List />
   * </Suggestion>
   */
  Clear: typeof SuggestionClear;
  /**
   * Component that provides a toggle button for the Suggestion list.
   *
   * Place as a descendant of `Suggestion`
   *
   * @example
   * <Suggestion>
   *   <Suggestion.Input />
   *   <Suggestion.Toggle />
   *   <Suggestion.Clear />
   *   <Suggestion.List />
   * </Suggestion>
   */
  Toggle: typeof SuggestionToggle;
};

/**
 * A component that provides a suggestion list for an input field.
 *
 * @example
 * <Suggestion>
 *   <Suggestion.Input />
 *   <Suggestion.Toggle />
 *   <Suggestion.Clear />
 *   <Suggestion.List>
 *     <Suggestion.Empty>Tomt</Suggestion.Empty>
 *     <Suggestion.Option value='Option 1'>Option 1</Suggestion.Option>
 *     <Suggestion.Option value='Option 2'>Option 2</Suggestion.Option>
 *   </Suggestion.List>
 * </Suggestion>
 */
const EXPERIMENTAL_Suggestion: Suggestion = Object.assign(SuggestionRoot, {
  List: SuggestionList,
  Input: SuggestionInput,
  Empty: SuggestionEmpty,
  Option: SuggestionOption,
  Toggle: SuggestionToggle,
  Clear: SuggestionClear,
});

EXPERIMENTAL_Suggestion.displayName = 'EXPERIMENTAL_Suggestion';
EXPERIMENTAL_Suggestion.List.displayName = 'EXPERIMENTAL_Suggestion.List';
EXPERIMENTAL_Suggestion.Input.displayName = 'EXPERIMENTAL_Suggestion.Input';
EXPERIMENTAL_Suggestion.Empty.displayName = 'EXPERIMENTAL_Suggestion.Empty';
EXPERIMENTAL_Suggestion.Option.displayName = 'EXPERIMENTAL_Suggestion.Option';
EXPERIMENTAL_Suggestion.Toggle.displayName = 'EXPERIMENTAL_Suggestion.Toggle';
EXPERIMENTAL_Suggestion.Clear.displayName = 'EXPERIMENTAL_Suggestion.Clear';

export type {
  SuggestionItem,
  SuggestionMultipleProps,
  SuggestionProps,
  SuggestionSingleProps,
} from './suggestion';
export type { SuggestionClearProps } from './suggestion-clear';
export type { SuggestionEmptyProps } from './suggestion-empty';
export type { SuggestionInputProps } from './suggestion-input';
export type { SuggestionListProps } from './suggestion-list';
export type { SuggestionOptionProps } from './suggestion-option';
export type { SuggestionToggleProps } from './suggestion-toggle';
export {
  EXPERIMENTAL_Suggestion,
  SuggestionClear as EXPERIMENTAL_SuggestionClear,
  SuggestionEmpty as EXPERIMENTAL_SuggestionEmpty,
  SuggestionInput as EXPERIMENTAL_SuggestionInput,
  SuggestionList as EXPERIMENTAL_SuggestionList,
  SuggestionOption as EXPERIMENTAL_SuggestionOption,
  SuggestionToggle as EXPERIMENTAL_SuggestionToggle,
};
