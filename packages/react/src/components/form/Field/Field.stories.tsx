import type { Meta, StoryFn } from '@storybook/react';

import { Label } from '../../Typography/Label';

import { Field } from '.';

type Story = StoryFn<typeof Field>;

export default {
  title: 'Komponenter/Field',
  component: Field,
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['textarea', 'input', 'select'],
    },
  },
} as Meta;

// TMP toggles to test a11yField utility
const toggles = {
  type: 'textarea',
  label: true,
  description: true,
  validation: true,
};

export const Preview: Story = (args) => {
  const { type, label, description, validation } = args as typeof toggles;
  const Component = type;

  return (
    <Field>
      {label && <Label style={{ display: 'block' }}>Kort beskrivelse</Label>}
      {description && <Field.Help>Beskrivelse</Field.Help>}
      <Component />
      {validation && <Field.Validation>Feilmelding</Field.Validation>}
    </Field>
  );
};

// @ts-expect-error
Preview.args = toggles;
