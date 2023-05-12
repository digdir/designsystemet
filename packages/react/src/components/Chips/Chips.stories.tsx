import React, { useState } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import Removable from './Removable';
import Toggle from './Toggle';

import { Chips, ChipsProps } from '.';

type Story = StoryObj<typeof Chips>;

export default {
  title: 'Kjernekomponenter/Chips',
  component: Chips,
  subcomponents: {
    Removable,
    Toggle,
  },
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

const options = ['Norsk', 'Dansk', 'Svensk', 'Tysk', 'Spansk'];
export const props: Story = {
  args: {
    children: (
      <>
        <Chips.Removable>Dansk</Chips.Removable>
        <Chips.Toggle>Fransk</Chips.Toggle>
        <Chips.Toggle selected={true}>Svensk</Chips.Toggle>
      </>
    ),
  },
};

export const propsRemovable: Story = {
  args: {
    children: 'Dansk',
  },
};

export const RemovableChip: StoryFn = () => {
  const [filter, setFilter] = useState(options);
  return (
    <div>
      <Chips>
        {filter.map((label) => (
          <Chips.Removable
            key={label}
            onClick={() =>
              setFilter((x) => x.filter((filter) => filter !== label))
            }
          >
            {label}
          </Chips.Removable>
        ))}
      </Chips>
    </div>
  );
};

export const ToggleChip: StoryFn = () => {
  const [selected, setSelected] = useState<number[]>([]);
  return (
    <Chips>
      {options.map((c, y) => (
        <Chips.Toggle
          selected={selected.includes(y)}
          onClick={() =>
            setSelected(
              selected.includes(y)
                ? selected.filter((x) => x !== y)
                : [...selected, y],
            )
          }
          key={y}
        >
          {c}
        </Chips.Toggle>
      ))}
    </Chips>
  );
};
