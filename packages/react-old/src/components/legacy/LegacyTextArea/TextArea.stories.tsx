import type { Meta, StoryObj } from '@storybook/react';

import type { LegacyTextAreaProps } from '.';
import { LegacyTextArea } from '.';

type Story = StoryObj<typeof LegacyTextArea>;

const meta: Meta = {
  title: 'Avviklet/LegacyTextArea',
  component: LegacyTextArea,
};

export default meta;

const Template = (args: LegacyTextAreaProps): JSX.Element => (
  <LegacyTextArea {...args} />
);

const createTemplate = (name: string, args?: LegacyTextAreaProps): Story => ({
  render: Template,
  name,
  args: { ...args },
});

export const Standard: Story = createTemplate('Standard');

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
