import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SkipLink } from '.';
type Story = StoryObj<typeof SkipLink>;

export default {
  title: 'Felles/SkipLink',
  component: SkipLink,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Preview: Story = () => (
  <>
    For å vise skiplinken, tab til dette eksempelet, eller klikk inni eksempelet
    og trykk <kbd>Tab</kbd>.
    <SkipLink href='#my-anchor'>Hopp til hovedinnhold</SkipLink>
    <main
      id='my-anchor'
      tabIndex={-1}
      style={{ padding: '1em', backgroundColor: '#dedede' }}
    >
      Region som kan motta fokus fra skiplink.
    </main>
  </>
);
