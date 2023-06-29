import type { SyntheticEvent } from 'react';
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
    onClick: (event: SyntheticEvent): void => {
      console.log('Clicked', event);
    },
  },
};

export const Default: StoryFn<typeof Chip> = () => {
  return <Chip size='small'>Nynorsk</Chip>;
};

export const ChipWithCheckmark: StoryFn<typeof Chip> = () => {
  return (
    <Chip
      size='small'
      checkmark
      selected
    >
      Nynorsk
    </Chip>
  );
};

export const Removable: StoryFn<typeof Chip> = () => {
  return (
    <Chip.Removable
      size='small'
      aria-label='Slett nynorsk'
    >
      Nynorsk
    </Chip.Removable>
  );
};

export const ToggleChip: StoryFn<typeof Chip> = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const chips: string[] = ['nynorsk', 'bokmål'];

  return (
    <Chip.Group size='small'>
      {chips.map((chip) => (
        <Chip
          key={chip}
          selected={selected === chip}
          onClick={() => setSelected(chip)}
          checkmark
        >
          {chip}
        </Chip>
      ))}
    </Chip.Group>
  );
};

export const ToggleMultiple: StoryFn<typeof Chip> = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const chips: string[] = ['nynorsk', 'bokmål'];

  const handleToggle = (chip: string) => {
    if (selected.includes(chip)) {
      setSelected((prev) => prev.filter((c) => c !== chip));
    } else {
      setSelected((prev) => [...prev, chip]);
    }
  };

  return (
    <Chip.Group size='small'>
      {chips.map((chip) => (
        <Chip
          checkmark
          key={chip}
          selected={selected.includes(chip)}
          onClick={() => handleToggle(chip)}
        >
          {chip}
        </Chip>
      ))}
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
