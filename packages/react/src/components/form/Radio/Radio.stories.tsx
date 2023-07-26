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
    value: 'value',
  },
};

export const Group: StoryFn<typeof Radio.Group> = () => {
  return (
    <Radio.Group legend='Er du over 18 år?'>
      <Radio value='Ja'>Ja</Radio>
      <Radio value='Ne'>Nei</Radio>
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
