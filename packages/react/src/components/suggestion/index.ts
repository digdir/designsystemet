import { Suggestion as SuggestionRoot } from './suggestion';
import { SuggestionChips } from './suggestion-chips';
import { SuggestionClear } from './suggestion-clear';
import { SuggestionEmpty } from './suggestion-empty';
import { SuggestionInput } from './suggestion-input';
import { SuggestionList } from './suggestion-list';
import { SuggestionOption } from './suggestion-option';

/**
 * A component that provides a suggestion list for an input field.
 *
 * @example
 * <Suggestion>
 *   <Suggestion.Input />
 *   <Suggestion.Clear />
 *   <Suggestion.List>
 *     <Suggestion.Empty>Tomt</Suggestion.Empty>
 *     <Suggestion.Option value='Option 1'>Option 1</Suggestion.Option>
 *     <Suggestion.Option value='Option 2'>Option 2</Suggestion.Option>
 *   </Suggestion.List>
 * </Suggestion>
 */
const EXPERIMENTAL_Suggestion = Object.assign(SuggestionRoot, {
  Chips: SuggestionChips,
  List: SuggestionList,
  Input: SuggestionInput,
  Empty: SuggestionEmpty,
  Option: SuggestionOption,
  Clear: SuggestionClear,
});

EXPERIMENTAL_Suggestion.displayName = 'EXPERIMENTAL_Suggestion';
EXPERIMENTAL_Suggestion.Chips.displayName = 'EXPERIMENTAL_Suggestion.Chips';
EXPERIMENTAL_Suggestion.List.displayName = 'EXPERIMENTAL_Suggestion.List';
EXPERIMENTAL_Suggestion.Input.displayName = 'EXPERIMENTAL_Suggestion.Input';
EXPERIMENTAL_Suggestion.Empty.displayName = 'EXPERIMENTAL_Suggestion.Empty';
EXPERIMENTAL_Suggestion.Option.displayName = 'EXPERIMENTAL_Suggestion.Option';
EXPERIMENTAL_Suggestion.Clear.displayName = 'EXPERIMENTAL_Suggestion.Clear';

export {
  EXPERIMENTAL_Suggestion,
  SuggestionChips as EXPERIMENTAL_SuggestionChips,
  SuggestionList as EXPERIMENTAL_SuggestionList,
  SuggestionInput as EXPERIMENTAL_SuggestionInput,
  SuggestionEmpty as EXPERIMENTAL_SuggestionEmpty,
  SuggestionOption as EXPERIMENTAL_SuggestionOption,
  SuggestionClear as EXPERIMENTAL_SuggestionClear,
};
export type {
  SuggestionProps,
  SuggestionSelected, // Export SuggestionValues for easier useState
  SuggestionSelected as SuggestionValues, // Kept for backwards compatibility
} from './suggestion';
export type { SuggestionChipsProps } from './suggestion-chips';
export type { SuggestionClearProps } from './suggestion-clear';
export type { SuggestionEmptyProps } from './suggestion-empty';
export type { SuggestionInputProps } from './suggestion-input';
export type { SuggestionListProps } from './suggestion-list';
export type { SuggestionOptionProps } from './suggestion-option';
