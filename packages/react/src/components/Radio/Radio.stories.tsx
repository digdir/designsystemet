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
  <Fieldset
    legend='Descriptive information about name change'
    description='description'
  >
    <Radio>Yes</Radio>
    <Radio>No</Radio>
  </Fieldset>
);

export const Multiple: StoryFn<typeof Radio> = () => (
  <Fieldset
    legend='What killed the radio star? 🎸'
    description='Video Killed the Radio Star is a song written by Trevor Horn, Geoff Downes and Bruce Woolley in 1979. It was recorded concurrently by Bruce Woolley and the Camera Club (with Thomas Dolby on keyboards) for their album English Garden and by British new wave/synth-pop group the Buggles, which consisted of Horn and Downes (and initially Woolley).'
  >
    <Radio description='Shakesparian twist'>Theater</Radio>
    <Radio description='VHS kids'>Video</Radio>
    <Radio description='Yippe ka ya '>Cinema</Radio>
  </Fieldset>
);
