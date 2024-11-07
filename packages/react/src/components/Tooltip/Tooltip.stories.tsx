import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Button } from '../..';

import { Tooltip } from '.';

type Story = StoryObj<typeof Tooltip>;

const defaultChildren = <Button>My trigger</Button>;

export default {
  title: 'Komponenter/Tooltip',
  component: Tooltip,
  parameters: {
    customStyles: { margin: '2rem' },
  },
} satisfies Meta;

export const Preview: StoryFn<typeof Tooltip> = (args) => (
  <Tooltip {...args}>
    <Button>My trigger</Button>
  </Tooltip>
);

Preview.args = {
  content: 'Tooltip text',
  placement: 'top',
};

export const Placement: Story = {
  args: {
    content: 'Tooltip text',
    placement: 'bottom',
    children: defaultChildren,
  },
};

export const DefaultOpen: Story = {
  args: {
    content: 'Tooltip text',
    defaultOpen: true,
    children: defaultChildren,
  },
  play: async () => {
    // Wait 500 ms to let tooltip fade in before running tests
    await new Promise((resolve) => setTimeout(resolve, 500));
  },
};

export const Portal: Story = {
  args: {
    content: 'Tooltip text',
    children: defaultChildren,
    placement: 'top',
    portal: true,
  },
};
