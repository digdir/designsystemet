import React, { useState } from 'react';
import type { Meta, StoryObj, StoryFn } from '@storybook/react';

import { Chip } from './index';

type Story = StoryObj<typeof Chip>;

export default {
  title: 'Kjernekomponenter/Chip',
  component: Chip,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Preview: Story = {
  args: {
    children: 'Nynorsk',
    size: 'small',
    selected: false,
    checkmark: false,
  },
};

export const Default: StoryFn<typeof Chip> = () => {
  return <Chip>Nynorsk</Chip>;
};

export const ChipWithCheckmark: StoryFn<typeof Chip> = () => {
  return (
    <Chip
      checkmark
      selected
    >
      Nynorsk
    </Chip>
  );
};

export const Removable: StoryFn<typeof Chip> = () => {
  return <Chip.Removable aria-label='Slett nynorsk'>Nynorsk</Chip.Removable>;
};

export const Group: StoryFn<typeof Chip> = () => {
  return (
    <Chip.Group>
      <Chip>Nynorsk</Chip>
      <Chip>Bokmål</Chip>
    </Chip.Group>
  );
};

export const RemovableGroup: StoryFn<typeof Chip> = () => {
  const [chips, setChips] = useState(['nynorsk', 'bokmål']);

  const handleRemove = (chip: string): void => {
    setChips((prev) => prev.filter((c) => c !== chip));
  };

  return (
    <Chip.Group size='small'>
      {chips.map((chip) => (
        <Chip.Removable
          key={chip}
          onClick={() => handleRemove(chip)}
          aria-label={`Slett ${chip}`}
        >
          {chip}
        </Chip.Removable>
      ))}
    </Chip.Group>
  );
};
