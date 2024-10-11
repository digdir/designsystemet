import type { Meta, StoryFn } from '@storybook/react';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Label } from '../../Label';

import { Field } from '.';
import { ValidationMessage } from '../../ValidationMessage';

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
  labelFor: '',
  ariaDesribedby: '',
  help: true,
  helpId: '',
  validation: true,
  validationId: '',
  moveToBody: false,
};

export const Preview: Story = (args) => {
  const {
    ariaDesribedby,
    type,
    label,
    labelFor,
    help,
    helpId,
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
    <Field data-my-field style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <Label htmlFor={labelFor || undefined}>Kort beskrivelse</Label>}
      {help && <Field.Help id={helpId || undefined}>Beskrivelse</Field.Help>}
      {type && <Component aria-describedby={ariaDesribedby || undefined} />}
      {validation && (
        <ValidationMessage data-my-validation id={validationId || undefined}>
          Feilmelding
        </ValidationMessage>
      )}
      {/* {createPortal(<div>Hei</div>, document.body)} */}
    </Field>
  );
};

// @ts-expect-error
Preview.args = toggles;
