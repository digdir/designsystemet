import type { HTMLAttributes, ReactNode } from 'react';
import { useContext } from 'react';
import type { DefaultProps } from '../../types';
import type { MergeRight } from '../../utilities';
import { Chip } from '../Chip';
import { MultiSelectContext } from './MultiSelect';

export type MultiSelectChipsProps = MergeRight<
  DefaultProps & HTMLAttributes<HTMLDivElement>,
  {
    /**
     * Change the rendered content of the chip.
     */
    render?: (args: {
      text: string;
      value: string;
      element: HTMLDataElement;
    }) => ReactNode;
  }
>;

export const MultiSelectChips = ({
  render = ({ text }) => text,
}: MultiSelectChipsProps) => {
  const { selectedItems } = useContext(MultiSelectContext);

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

MultiSelectChips.displayName = 'MultiSelectChips';
