import type { Meta, StoryObj } from '@storybook/react';

import type { LegacyTextFieldProps } from '.';
import { LegacyTextField } from '.';

type Story = StoryObj<typeof LegacyTextField>;

const meta: Meta<typeof LegacyTextField> = {
  title: 'Avviklet/LegacyTextField',
  component: LegacyTextField,
};

export default meta;

const createTemplate = (name: string, args?: LegacyTextFieldProps): Story => ({
  render: (args) => <LegacyTextField {...args} />,
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
  readOnly: 'readonlyInfo',
  value: 'Dette er en skrivebeskyttet tekst.',
});

export const Bekreftelsesvisning: Story = createTemplate(
  'Bekreftelsesvisning',
  {
    readOnly: 'readonlyConfirm',
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
