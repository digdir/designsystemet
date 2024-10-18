import type { Meta, StoryFn } from '@storybook/react';

import { useEffect } from 'react';
import { Label } from '../../Label';

import { Field } from '.';
import { ValidationMessage } from '../../ValidationMessage';
import { Input } from '../Input';
import { Select } from '../Select';
import { Textarea } from '../Textarea';

type Story = StoryFn<typeof Field>;

export default {
  title: 'Komponenter/Field',
  component: Field,
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['textarea', 'input', 'select', false],
      mapping: { textarea: Textarea, input: Input, select: Select },
    },
  },
} as Meta;

// TMP toggles to test a11yField utility
const toggles = {
  type: 'textarea',
  inputId: '',
  label: true,
  labelFor: '',
  description: true,
  descriptionId: '',
  validation: true,
  validationId: '',
  moveToBody: false,
};

export const Preview: Story = (args) => {
  const {
    type,
    inputId,
    label,
    labelFor,
    description,
    descriptionId,
    validation,
    validationId,
    moveToBody,
  } = args as typeof toggles;
  const Component = type as keyof JSX.IntrinsicElements;

  useEffect(() => {
    const label = document.querySelector('label');
    const valid = document.querySelector('[data-my-validation]');
    const field = document.querySelector('[data-my-field]');
    const root = moveToBody ? document.body : field;
    if (valid && valid.parentElement !== root) root?.append(valid);
    if (label && label.parentElement !== root) root?.prepend(label);
  }, [moveToBody]);

  return (
    <Field data-my-field>
      {label && <Label htmlFor={labelFor || undefined}>Kort beskrivelse</Label>}
      {description && (
        <Field.Description id={descriptionId || undefined}>
          Beskrivelse
        </Field.Description>
      )}
      {type && <Component id={inputId || undefined} />}
      {validation && (
        <ValidationMessage data-my-validation id={validationId || undefined}>
          Feilmelding
        </ValidationMessage>
      )}
    </Field>
  );
};

// @ts-expect-error ts2559: Preview.args uses more properties for testing than what is supported by <Field>
Preview.args = toggles;
