import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Card } from '..';
import { Select } from '../../Select';
import { Textfield } from '../../form/Textfield';

import { CardGroup } from './';

const meta: Meta<typeof CardGroup> = {
  title: 'Felles/Card/Group',
  component: CardGroup,
};

export default meta;

type Story = StoryFn<typeof CardGroup>;

export const Preview: Story = (args) => (
  <Card.Group {...args}>
    <Card.RoleCard title='Rolle 1'>
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
    </Card.RoleCard>
    <Card.RoleCard title='Rolle 2'>
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
    </Card.RoleCard>
  </Card.Group>
);
