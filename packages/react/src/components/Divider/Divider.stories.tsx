import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Divider } from './';
import { Paragraph } from '../Typography';

type Story = StoryFn<typeof Divider>;

export default {
  title: 'Primitives/Divider',
  component: Divider,
} as Meta;

export const Preview: Story = (args) => (
  <>
    <Paragraph>
      Divider er brukt for å dele opp innhold i mindre deler.
    </Paragraph>
    <Divider {...args} />
    <Paragraph>
      Den kan også brukes for å skille innhold som er relatert til hverandre.
    </Paragraph>
  </>
);
Preview.args = {
  color: 'default',
};
