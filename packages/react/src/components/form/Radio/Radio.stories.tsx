import { log } from 'console';

import type { ChangeEvent } from 'react';
import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import { RadioGroup } from './Group';

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

export const Inline: StoryFn<typeof Radio> = () => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <RadioGroup
      legend='Descriptive information about name change'
      description='description'
      onChange={onChange}
    >
      <Radio value='yes'>Yes</Radio>
      <Radio value='no'>No</Radio>
    </RadioGroup>
  );
};

export const Multiple: StoryFn<typeof Radio> = () => (
  <RadioGroup
    legend='Velg pizza (påkreved)'
    description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
    error='Du må velge en av våre pizzaer for å legge inn bestilling'
  >
    <Radio value='ost'>Bare ost</Radio>
    <Radio
      value='Dobbeldekker'
      description='Chorizo spesial med kokkens luksuskylling'
    >
      Dobbeldekker
    </Radio>
    <Radio value='flammen'>Flammen</Radio>
    <Radio value='snadder'>Snadder</Radio>
  </RadioGroup>
);
