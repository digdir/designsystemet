import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { Fieldset } from './Fieldset';

import { Radio } from '.';

type Story = StoryObj<typeof Radio>;

export default {
  title: 'Kjernekomponenter/Form/Radio',
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
    disabled: false,
    readOnly: false,
    error: false,
  },
};

export const Inline: StoryFn<typeof Radio> = () => (
  <Fieldset legend='Have you changed your name?'>
    <Radio>Yes</Radio>
    <Radio>No</Radio>
  </Fieldset>
);

export const Multiple: StoryFn<typeof Radio> = () => (
  <Fieldset legend='What killed the radio star? 🎸'>
    <Radio
      readOnly
      description='Shakesparian twist'
    >
      Theater
    </Radio>
    <Radio description='VHS kids'>Video</Radio>
    <Radio description='Yippe ka ya '>Cinema</Radio>
  </Fieldset>
);
