import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Radio } from '.';

type Story = StoryObj<typeof Radio>;

export default {
  title: 'Kjernekomponenter/Radio',
  component: Radio,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

// Simple story
// First story is the one displayed by <Preview /> and used for <Controls />
export const Preview: Story = {
  args: {
    children: 'You created the Radio component!',
    description: 'Description',
  },
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof Radio> = () => (
  <fieldset>
    <legend>
      What killed the radio star?
      <span
        role='img'
        aria-label='guitar emoji'
      >
        🎸
      </span>
    </legend>
    <ul style={{ listStyle: 'none' }}>
      <li>
        <Radio description='Shakesparian twist'>Theater</Radio>
      </li>
      <li>
        <Radio description='VHS kids'>Video</Radio>
      </li>
      <li>
        <Radio description='Yippe ka ya '>Cinema</Radio>
      </li>
    </ul>
  </fieldset>
);
