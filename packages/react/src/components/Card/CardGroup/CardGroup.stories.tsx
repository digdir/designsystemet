import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { TrashFillIcon } from '@navikt/aksel-icons';

import { Card } from '..';
import { NativeSelect } from '../../form/NativeSelect';
import { Textfield } from '../../form/Textfield';
import { Paragraph } from '../../Typography';
import { Button } from '../../Button';
import { Divider } from '../../Divider';

import { CardGroup } from './';

const meta: Meta<typeof CardGroup> = {
  title: 'Felles/Card/Group',
  component: CardGroup,
};

export default meta;

const options = [
  { value: 'daglig leder', label: 'Dalig leder' },
  { value: 'forretningsfører', label: 'Forretningsfører' },
];

type Story = StoryFn<typeof CardGroup>;

export const Preview: Story = (args) => (
  <Card.Group {...args}>
    <Card>
      <Card.Header>
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
      <Divider color='subtle' />
      <Card.Content>
        <NativeSelect label='Velg rolle'>
          {options.map(({ value, label }, index) => (
            <option
              key={index}
              value={value}
            >
              {label}
            </option>
          ))}
        </NativeSelect>
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
    <Card>
      <Card.Header>
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
      <Divider color='subtle' />
      <Card.Content>
        <NativeSelect label='Velg rolle'>
          {options.map(({ value, label }, index) => (
            <option
              key={index}
              value={value}
            >
              {label}
            </option>
          ))}
        </NativeSelect>
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
