import React from 'react';
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
    size: 'xsmall',
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
