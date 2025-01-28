import { Suggestion as SuggestionRoot } from './Suggestion';
import { SuggestionClear } from './SuggestionClear';
import { SuggestionEmpty } from './SuggestionEmpty';
import { SuggestionInput } from './SuggestionInput';
import { SuggestionList } from './SuggestionList';
import { SuggestionOption } from './SuggestionOption';

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
  List: SuggestionList,
  Input: SuggestionInput,
  Empty: SuggestionEmpty,
  Option: SuggestionOption,
  Clear: SuggestionClear,
});

EXPERIMENTAL_Suggestion.displayName = 'EXPERIMENTAL_Suggestion';
EXPERIMENTAL_Suggestion.List.displayName = 'EXPERIMENTAL_Suggestion.List';
EXPERIMENTAL_Suggestion.Input.displayName = 'EXPERIMENTAL_Suggestion.Input';
EXPERIMENTAL_Suggestion.Empty.displayName = 'EXPERIMENTAL_Suggestion.Empty';
EXPERIMENTAL_Suggestion.Option.displayName = 'EXPERIMENTAL_Suggestion.Option';
EXPERIMENTAL_Suggestion.Clear.displayName = 'EXPERIMENTAL_Suggestion.Clear';

export {
  EXPERIMENTAL_Suggestion,
  SuggestionList as EXPERIMENTAL_SuggestionList,
  SuggestionInput as EXPERIMENTAL_SuggestionInput,
  SuggestionEmpty as EXPERIMENTAL_SuggestionEmpty,
  SuggestionOption as EXPERIMENTAL_SuggestionOption,
  SuggestionClear as EXPERIMENTAL_SuggestionClear,
};
export type { SuggestionProps } from './Suggestion';
export type { SuggestionListProps } from './SuggestionList';
export type { SuggestionInputProps } from './SuggestionInput';
export type { SuggestionEmptyProps } from './SuggestionEmpty';
export type { SuggestionOptionProps } from './SuggestionOption';
export type { SuggestionClearProps } from './SuggestionClear';
