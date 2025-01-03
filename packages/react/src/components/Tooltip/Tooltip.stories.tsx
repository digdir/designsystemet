import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Tooltip } from '.';
import { Button } from '../..';

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

export const WithString: Story = {
  args: {
    content: 'Tooltip text',
    children: 'My trigger',
  },
};

export const Placement: Story = {
  args: {
    content: 'Tooltip text',
    placement: 'bottom',
    children: defaultChildren,
  },
};
