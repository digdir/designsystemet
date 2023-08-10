import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ReadOnlyVariant } from '../../types/enums';

import type { TextFieldProps } from '.';
import { TextField } from '.';

type Story = StoryObj<typeof TextField>;

const meta: Meta<typeof TextField> = {
  title: 'Kjernekomponenter/TextField',
  component: TextField,
};

export default meta;

const createTemplate = (name: string, args?: TextFieldProps): Story => ({
  render: (args) => <TextField {...args} />,
  args,
  name,
});

export const Standard: Story = createTemplate('Standard', {
  isValid: false,
});

export const Tallformat: Story = createTemplate('Tallformat', {
  formatting: {
    number: {
      thousandSeparator: ' ',
      prefix: 'NOK ',
    },
  },
  defaultValue: 1000000,
});

export const MedFeil: Story = createTemplate('Med feil', {
  isValid: false,
});

export const Skrivebeskyttet: Story = createTemplate('Skrivebeskyttet', {
  readOnly: ReadOnlyVariant.ReadOnlyInfo,
  value: 'Dette er en skrivebeskyttet tekst.',
});

export const Bekreftelsesvisning: Story = createTemplate(
  'Bekreftelsesvisning',
  {
    readOnly: ReadOnlyVariant.ReadOnlyConfirm,
    value:
      'Dette er en bekreftelsesvisning av en tekst som er skrevet inn i et tekstfelt.',
  },
);

export const Deaktivert: Story = createTemplate('Deaktivert', {
  disabled: true,
});

export const AntallTegnIgjenASkrive: Story = createTemplate(
  'Antall tegn igjen å skrive',
  {
    label: 'Kommentar',
    characterLimit: {
      maxCount: 10,
      label: (count: number) =>
        count >= 0
          ? `Du har ${count} tegn igjen`
          : `Du har ${Math.abs(count)} tegn for mye`,
      srLabel: 'Tekstområdet har plass til 10 tegn.',
    },
  },
);
