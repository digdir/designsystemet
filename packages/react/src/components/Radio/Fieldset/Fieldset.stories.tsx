import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Fieldset } from '.';

type Story = StoryObj<typeof Fieldset>;

export default {
  title: 'Kjernekomponenter/Fieldset',
  component: Fieldset,
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
    children: 'You created the Fieldset component!',
    myProp: false, // we set this so "boolean" is set in props table
  },
};

// Function story
// Use this story for listing our different variants, patterns with other components or examples usage with useState
export const Composed: StoryFn<typeof Fieldset> = () => (
  <>
    <Fieldset myProp>I</Fieldset>
    <Fieldset>am</Fieldset>
    <Fieldset myProp>stacked</Fieldset>
  </>
);
