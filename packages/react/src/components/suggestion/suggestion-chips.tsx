import type { HTMLAttributes, ReactNode } from 'react';
import { useContext } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Chip } from '../chip';
import { SuggestionContext } from './suggestion';

export type SuggestionChipsProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Change the rendered content of the chip.
     *
     * @default ({ label }) => label
     */
    render?: (args: { label: string; value: string }) => ReactNode;
  }
>;

export const SuggestionChips = ({
  render = ({ label }) => label,
}: SuggestionChipsProps) => {
  const { selectedItems = [] } = useContext(SuggestionContext);

  return (
    <>
      {selectedItems.map((item) => (
        <Chip.Removable key={item.value} value={item.value} asChild>
          <data>{render(item)}</data>
        </Chip.Removable>
      ))}
    </>
  );
};

SuggestionChips.displayName = 'SuggestionChips';
