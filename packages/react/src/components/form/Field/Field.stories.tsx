import type { Meta, StoryFn } from '@storybook/react';

import { Label } from '../../Typography/Label';

import { Field } from '.';
import { ValidationMessage } from '../../Typography';

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
  ariaDesribedby: '',
  description: true,
  descriptionId: '',
  validation: true,
  validationId: '',
};

export const Preview: Story = (args) => {
  const {
    ariaDesribedby,
    type,
    label,
    description,
    descriptionId,
    validation,
    validationId,
  } = args as typeof toggles;
  const Component = type;

  return (
    <Field>
      {label && <Label style={{ display: 'block' }}>Kort beskrivelse</Label>}
      {description && (
        <Field.Description id={descriptionId || undefined}>
          Beskrivelse
        </Field.Description>
      )}
      <Component aria-describedby={ariaDesribedby || undefined} />
      {validation && (
        <ValidationMessage id={validationId || undefined}>
          Feilmelding
        </ValidationMessage>
      )}
    </Field>
  );
};

// @ts-expect-error
Preview.args = toggles;
