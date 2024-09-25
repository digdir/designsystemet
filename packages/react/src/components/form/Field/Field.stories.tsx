import type { Meta, StoryFn } from '@storybook/react';

import { Label } from '../../Typography/Label';

import { Field } from '.';

type Story = StoryFn<typeof Field>;

export default {
  title: 'Komponenter/Field',
  component: Field,
} as Meta;

// TMP toggles to test a11yField utility
const toggles = {
  label: true,
  description: true,
  validation: true,
};

export const Preview: Story = (args) => {
  const { label, description, validation } = args as typeof toggles;

  return (
    <Field>
      {label && <Label>Kort beskrivelse</Label>}
      {description && <Field.Help>Beskrivelse</Field.Help>}
      <textarea style={{ display: 'block' }} />
      {validation && <Field.Validation>Feilmelding</Field.Validation>}
    </Field>
  );
};

// @ts-expect-error
Preview.args = toggles;
