import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { TextField } from '../TextField';

import { FieldSet } from './FieldSet';

export default {
  title: 'Utgår/FieldSet',
  component: FieldSet,
} as Meta;

export const Eksempel: StoryFn<typeof FieldSet> = (args) => (
  <FieldSet {...args}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <TextField label='Navn' />
      <TextField
        type='date'
        label='Fødselsdato'
      />
    </div>
  </FieldSet>
);

Eksempel.args = {
  legend: 'Personlig informasjon',
  description: 'Oppgi navn og fødselsdato.',
  size: 'small',
};
