import type { HTMLAttributes, ReactNode } from 'react';
import { useContext, useEffect } from 'react';
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
  const { uTagsRef, selectedItems, setSelectedItems } =
    useContext(MultiSelectContext);

  useEffect(() => {
    if (!uTagsRef?.current) return;

    const handleItemsChange = (
      e: CustomEvent<{
        action: 'add' | 'remove';
        item: HTMLDataElement;
      }>,
    ) => {
      console.log(e);
      e.preventDefault();
      const item = e.detail.item;

      if (e.detail.action === 'add') {
        setSelectedItems((prevItems) => ({
          ...prevItems,
          [item.value]: item,
        }));
      } else {
        setSelectedItems((prevItems) => {
          const newItems = { ...prevItems };
          delete newItems[item.value];
          return newItems;
        });
      }
    };

    uTagsRef.current.addEventListener('tags', handleItemsChange);

    return () => {
      uTagsRef.current?.removeEventListener;
    };
  }, [uTagsRef]);

  return (
    <>
      {selectedItems &&
        Object.values(selectedItems).map((item) => (
          <Chip.Removable key={item.value} asChild>
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
