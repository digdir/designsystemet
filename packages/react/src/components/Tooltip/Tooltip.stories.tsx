import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { Tooltip } from '.';
import { Button } from '../..';

type Story = StoryObj<typeof Tooltip>;

const defaultChildren = <Button>My trigger</Button>;

export default {
  title: 'Komponenter/Tooltip',
  component: Tooltip,
  parameters: {
    customStyles: { margin: '2rem', padding: '4rem' },
    chromatic: {
      disableSnapshot: false,
    },
  },
  play: async (ctx) => {
    // When not in Docs mode, automatically open the tooltip
    const canvas = within(ctx.canvasElement);
    const button = canvas.getByRole('button');
    /* wait 1s for tooltip to show */
    await userEvent.hover(button);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
    const tooltip = canvas.getByRole('tooltip');
    await expect(tooltip).toBeInTheDocument();
    await expect(tooltip).toBeVisible();
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

WithString.play = async (ctx) => {
  // When not in Docs mode, automatically open the tooltip
  const canvas = within(ctx.canvasElement);
  const button = canvas.getByText('My trigger');
  await userEvent.hover(button);
  /* wait 1s for tooltip to show */
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
  const tooltip = canvas.getByRole('tooltip');
  await expect(tooltip).toBeInTheDocument();
  await expect(tooltip).toBeVisible();
};

export const Placement: Story = {
  args: {
    content: 'Tooltip text',
    placement: 'bottom',
    children: defaultChildren,
  },
};
