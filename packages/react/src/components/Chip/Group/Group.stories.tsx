import type { Meta, StoryFn } from '@storybook/react';

import { Chip } from '..';

import { Group } from './Group';

const meta: Meta<typeof Group> = {
  title: 'Komponenter/Chip/Group',
  component: Group,
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryFn<typeof Group>;

export const Preview: Story = (args) => (
  <Chip.Group {...args}>
    <Chip.Toggle>Nynorsk</Chip.Toggle>
    <Chip.Toggle>Bokmål</Chip.Toggle>
  </Chip.Group>
);

Preview.args = {
  size: 'sm',
};

export const CheckGroup: Story = (args) => (
  <Chip.Group {...args}>
    <Chip.Toggle selected checkmark>
      Utsikt
    </Chip.Toggle>
    <Chip.Toggle>Heis</Chip.Toggle>
    <Chip.Toggle selected checkmark>
      Strandlinje
    </Chip.Toggle>
    <Chip.Toggle>Vaskemaskin</Chip.Toggle>
    <Chip.Toggle>Dyrevennlig</Chip.Toggle>
  </Chip.Group>
);
