import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button, Paragraph } from '../../..';
import { Checkbox } from '../';

export default {
  title: 'ikke utgitt/Radio/Group',
  component: Checkbox.Group,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
} as Meta;

export const Preview: StoryFn<typeof Checkbox.Group> = (args) => (
  <Checkbox.Group {...args}>
    <Checkbox value='vanilje'>Vanilje</Checkbox>
    <Checkbox value='jordbær'>Jordbær</Checkbox>
    <Checkbox value='sjokolade'>Sjokolade</Checkbox>
    <Checkbox value='spiser-ikke-is'>Jeg spiser ikke iskrem</Checkbox>
  </Checkbox.Group>
);

Preview.args = {
  legend: 'Hvilken iskremsmak er best?',
  description: 'Velg din favorittsmak blant alternativene.',
  readOnly: false,
  disabled: false,
  error: '',
};

export const Error: StoryFn<typeof Checkbox> = () => (
  <Checkbox.Group
    legend='Velg pizza (påkreved)'
    description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
    error='Du må velge en av våre pizzaer for å legge inn bestilling'
  >
    <Checkbox value='ost'>Bare ost</Checkbox>
    <Checkbox
      value='Dobbeldekker'
      description='Chorizo spesial med kokkens luksuskylling'
    >
      Dobbeldekker
    </Checkbox>
    <Checkbox value='flammen'>Flammen</Checkbox>
    <Checkbox value='snadder'>Snadder</Checkbox>
  </Checkbox.Group>
);

export const Controlled: StoryFn<typeof Checkbox> = () => {
  const [value, setValue] = useState<string>();

  return (
    <>
      <span style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => setValue('flammen')}>Velg Flammen</Button>
        <Button onClick={() => setValue('snadder')}>Velg Snadder</Button>
        <Paragraph spacing>Du har valgt: {value}</Paragraph>
      </span>
      <Checkbox.Group
        legend='Velg pizza (påkreved)'
        description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        <Checkbox value='ost'>Bare ost</Checkbox>
        <Checkbox
          value='Dobbeldekker'
          description='Chorizo spesial med kokkens luksuskylling'
        >
          Dobbeldekker
        </Checkbox>
        <Checkbox value='flammen'>Flammen</Checkbox>
        <Checkbox value='snadder'>Snadder</Checkbox>
      </Checkbox.Group>
    </>
  );
};

export const ReadOnly = Preview.bind({});

ReadOnly.args = {
  ...Preview.args,
  readOnly: true,
};

export const Disabled = Preview.bind({});

Disabled.args = {
  ...Preview.args,
  disabled: true,
};
