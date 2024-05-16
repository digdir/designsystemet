import type { Meta, StoryFn } from '@storybook/react';

import { LegacyTextField } from '../LegacyTextField';

import { LegacyFieldSet } from './FieldSet';

export default {
  title: 'Avviklet/LegacyFieldSet',
  component: LegacyFieldSet,
} as Meta;

export const Eksempel: StoryFn<typeof LegacyFieldSet> = (args) => (
  <LegacyFieldSet {...args}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <LegacyTextField label='Navn' />
      <LegacyTextField
        type='date'
        label='Fødselsdato'
      />
    </div>
  </LegacyFieldSet>
);

Eksempel.args = {
  legend: 'Personlig informasjon',
  description: 'Oppgi navn og fødselsdato.',
  size: 'small',
};
