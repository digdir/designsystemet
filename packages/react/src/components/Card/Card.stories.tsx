import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Textfield } from '../form/Textfield';
import { Select } from '../Select';
import { Heading } from '../Typography';

import { Card } from '.';

type Story = StoryFn<typeof Card>;

export default {
  title: 'Felles/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
} as Meta;

export const Preview: Story = (args) => (
  <Card {...args}>
    <Card.Section
      direction='row'
      justifyContent='space-between'
    >
      <Heading size='small'>Rolle 1</Heading>
    </Card.Section>
    <Card.Section>
      <Select
        label='Velg rolle'
        options={[
          { value: 'daglig leder', label: 'Dalig leder' },
          { value: 'forretningsfører', label: 'Forretningsfører' },
        ]}
      />
      <Textfield
        size='small'
        label='Fødsels- eller d-nummer'
      />
      <Textfield
        size='small'
        label='Etternavn'
      />
    </Card.Section>
  </Card>
);
