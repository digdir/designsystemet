import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import { HelpText } from '.';

type Story = StoryObj<typeof HelpText>;

export default {
  title: 'Komponenter/HelpText',
  component: HelpText,
} satisfies Meta;

export const Preview: Story = {
  args: {
    'aria-label': 'Help text title',
    children: 'Help text content',
    'data-size': 'md',
  },
};

export const Toggled: Story = {
  ...Preview,
  args: { ...Preview.args },
  parameters: {
    customStyles: {
      paddingRight: '13rem',
    },
  },
  play: async (ctx) => {
    const canvas = within(ctx.canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
    const popover = ctx.canvasElement.querySelector('[popover]');
    await expect(popover).toBeVisible();
  },
};
