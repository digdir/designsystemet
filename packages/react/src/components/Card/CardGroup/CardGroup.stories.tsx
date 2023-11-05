import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { TrashFillIcon } from '@navikt/aksel-icons';

import { Card } from '..';
import { Select } from '../../Select';
import { Textfield } from '../../form/Textfield';
import { Paragraph } from '../../Typography';
import { Button } from '../../Button';

import { CardGroup } from './';

const meta: Meta<typeof CardGroup> = {
  title: 'Felles/Card/Group',
  component: CardGroup,
};

export default meta;

type Story = StoryFn<typeof CardGroup>;

export const Preview: Story = (args) => (
  <Card.Group {...args}>
    <Card
      borderRadius='large'
      border='subtle'
    >
      <Card.Header divided>
        <Paragraph size='medium'>Rolle 1</Paragraph>
        <Button
          variant='secondary'
          color='danger'
          size='small'
          icon={<TrashFillIcon aria-hidden />}
        >
          Fjern
        </Button>
      </Card.Header>
      <Card.Content>
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
      </Card.Content>
    </Card>
    <Card
      borderRadius='large'
      border='subtle'
    >
      <Card.Header divided>
        <Paragraph size='medium'>Rolle 2</Paragraph>
        <Button
          variant='secondary'
          color='danger'
          size='small'
          icon={<TrashFillIcon aria-hidden />}
        >
          Fjern
        </Button>
      </Card.Header>
      <Card.Content>
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
      </Card.Content>
    </Card>
  </Card.Group>
);
