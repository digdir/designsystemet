import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { FieldSet } from '../FieldSet';

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

export const Inline: StoryFn<typeof Radio> = () => (
  <FieldSet legend='Have you changed your name?'>
    <Radio>Yes</Radio>
    <Radio>No</Radio>
  </FieldSet>
);

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof Radio> = () => (
  <FieldSet
    legend='What killed the radio star? 🎸'
    helpText='help me'
  >
    <Radio
      readOnly
      description='Shakesparian twist'
    >
      Theater
    </Radio>
    <Radio description='VHS kids'>Video</Radio>
    <Radio description='Yippe ka ya '>Cinema</Radio>
  </FieldSet>
);
