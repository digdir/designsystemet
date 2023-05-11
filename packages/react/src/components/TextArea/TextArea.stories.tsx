import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ReadOnlyVariant } from '../../types/enums';

import type { TextAreaProps } from '.';
import { TextArea } from '.';

type Story = StoryObj<typeof TextArea>;

const meta: Meta = {
  title: 'Kjernekomponenter/TextArea',
  component: TextArea,
  parameters: {
    status: {
      type: 'beta',
      url: 'http://www.url.com/status',
    },
  },
};

export default meta;

const Template = (args: TextAreaProps): JSX.Element => <TextArea {...args} />;

const createTemplate = (name: string, args?: TextAreaProps): Story => ({
  render: Template,
  name,
  args: { ...args },
});

export const Standard: Story = createTemplate('Standard');

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
    charLimit: {
      maxCount: 10,
      label: (count: number) => `${count} tegn igjen`,
      srLabel: 'Tekstområdet har plass til 10 tegn.',
    },
  },
);
