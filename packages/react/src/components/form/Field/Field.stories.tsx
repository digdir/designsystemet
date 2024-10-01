import type { Meta, StoryFn } from '@storybook/react';

import { useEffect } from 'react';
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
      options: ['textarea', 'input', 'select', false],
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
  moveToBody: false,
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
    moveToBody,
  } = args as typeof toggles;
  const Component = type;

  useEffect(() => {
    const valid = document.querySelector('[data-my-validation]');
    const field = document.querySelector('[data-my-field]');
    const root = moveToBody ? document.body : field;
    if (valid && valid.parentElement !== root) root?.appendChild(valid);
  }, [moveToBody]);

  return (
    <Field data-my-field>
      {label && <Label style={{ display: 'block' }}>Kort beskrivelse</Label>}
      {description && (
        <Field.Description id={descriptionId || undefined}>
          Beskrivelse
        </Field.Description>
      )}
      {type && <Component aria-describedby={ariaDesribedby || undefined} />}
      {validation && (
        <ValidationMessage data-my-validation id={validationId || undefined}>
          Feilmelding
        </ValidationMessage>
      )}
    </Field>
  );
};

// @ts-expect-error
Preview.args = toggles;
