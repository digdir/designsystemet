import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SkipLink } from '.';
type Story = StoryObj<typeof SkipLink>;

export default {
  title: 'Felles/SkipLink',
  component: SkipLink,
} as Meta;

export const Preview: Story = () => (
  <>
    For å vise skiplinken, tab til dette eksempelet, eller klikk inni eksempelet
    og trykk <kbd>Tab</kbd>.
    <SkipLink href='#main-content'>Hopp til hovedinnhold</SkipLink>
    <main
      id='main-content'
      tabIndex={-1}
    >
      Region som kan motta fokus fra skiplink.
    </main>
  </>
);
