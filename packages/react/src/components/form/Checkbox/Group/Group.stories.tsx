import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Button, Paragraph } from '../../..';
import { Checkbox } from '../';

export default {
  title: 'Felles/Checkbox/Group',
  component: Checkbox.Group,
} as Meta;

export const Preview: StoryFn<typeof Checkbox.Group> = (args) => (
  <Checkbox.Group {...args}>
    <Checkbox value='pizza'>Pizza</Checkbox>
    <Checkbox value='burger'>Burger</Checkbox>
    <Checkbox
      value='vegetarburger'
      description='Burgeren er laget av kikerter'
    >
      Vegetarburger
    </Checkbox>
    <Checkbox value='sushi'>Sushi</Checkbox>
  </Checkbox.Group>
);

Preview.args = {
  legend: 'Middag',
  description: 'Mat serveres klokken 18:00',
  readOnly: false,
  disabled: false,
  error: '',
};

export const Error: StoryFn<typeof Checkbox> = () => (
  <Checkbox.Group
    legend='Velg pizza '
    description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
    error='Du må velge minst én pizza for å legge inn bestilling'
  >
    <Checkbox value='ost'>Bare ost</Checkbox>
    <Checkbox value='Dobbeldekker'>Dobbeldekker</Checkbox>
    <Checkbox value='flammen'>Flammen</Checkbox>
    <Checkbox value='snadder'>Snadder</Checkbox>
  </Checkbox.Group>
);

export const Controlled: StoryFn<typeof Checkbox> = () => {
  const [value, setValue] = useState<string[]>([]);

  const myToggle = (val: string) =>
    setValue(
      value.includes(val) ? value.filter((x) => x !== val) : [...value, val],
    );
  return (
    <>
      <span style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => myToggle('flammen')}>Toggle Flammen</Button>
        <Button onClick={() => myToggle('snadder')}>Toggle Snadder</Button>
        <Paragraph spacing>Du har valgt: {value.toString()}</Paragraph>
      </span>
      <Checkbox.Group
        legend='Velg pizza'
        description='Alle pizzaene er laget på våre egne nybakte bunner og serveres med kokkens egen osteblanding og tomatsaus.'
        value={value}
        onChange={(value) => setValue(value)}
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
  value: ['burger'],
};

export const Disabled = Preview.bind({});

Disabled.args = {
  ...Preview.args,
  disabled: true,
  value: ['pizza'],
};
