import type { ChangeEvent } from 'react';
import React from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

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

export const Preview: Story = {
  args: {
    children: 'Radio',
    description: 'Description',
    disabled: false,
    readOnly: false,
    error: false,
    value: 'value',
  },
};

export const Group: StoryFn<typeof Radio.Group> = () => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <Radio.Group
      legend='Descriptive information about name change'
      description='description'
      onChange={onChange}
      onClick={(e) => {
        console.log('onClick', e.currentTarget);
      }}
    >
      <Radio value='yes'>Yes</Radio>
      <Radio value='no'>No</Radio>
    </Radio.Group>
  );
};

export const groupError: StoryFn<typeof Radio> = () => (
  <Radio.Group
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
  </Radio.Group>
);
