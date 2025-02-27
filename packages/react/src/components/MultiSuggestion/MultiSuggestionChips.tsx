import type { HTMLAttributes, ReactNode } from 'react';
import { useContext } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Chip } from '../Chip';
import { MultiSuggestionContext } from './MultiSuggestion';

export type MultiSuggestionChipsProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Change the rendered content of the chip.
     *
     * @default ({ value }) => value
     */
    render?: (args: {
      text: string;
      value: string;
      element: HTMLDataElement;
    }) => ReactNode;
  }
>;

export const MultiSuggestionChips = ({
  render = ({ value }) => value,
}: MultiSuggestionChipsProps) => {
  const { selectedItems } = useContext(MultiSuggestionContext);

  return (
    <>
      {selectedItems &&
        Object.values(selectedItems).map((item) => (
          <Chip.Removable key={item.value} value={item.value} asChild>
            <data>
              {render({
                text: item.textContent || item.value,
                value: item.value,
                element: item,
              })}
            </data>
          </Chip.Removable>
        ))}
    </>
  );
};

MultiSuggestionChips.displayName = 'MultiSuggestionChips';
