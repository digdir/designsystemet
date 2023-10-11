import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import React from 'react';

import { Paragraph, Button } from '../..';

import { Tooltip } from '.';

type Story = StoryObj<typeof Tooltip>;

const defaultChildren = <Button>My trigger</Button>;

export default {
  title: 'Felles/Tooltip',
  component: Tooltip,
} as Meta;

export const Preview: Story = {
  args: {
    content: 'Tooltip text',
    children: defaultChildren,
  },
  decorators: [
    (Story: StoryFn) => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
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
};

export const Complex: StoryFn<typeof Tooltip> = () => {
  return (
    <Paragraph>
      Du kan ha{' '}
      <Tooltip content='Kan gi bra brukeropplevelse'>
        <span
          style={{ fontWeight: 'bold', textDecoration: 'underline dotted' }}
        >
          tooltip
        </span>
      </Tooltip>{' '}
      inne i tekst også
    </Paragraph>
  );
};
