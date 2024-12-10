import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button, Divider, Paragraph } from '../..';

import { Textfield } from '.';

type Story = StoryObj<typeof Textfield>;

export default {
  title: 'Komponenter/Textfield',
  component: Textfield,
  argTypes: {
    multiline: {
      type: 'boolean',
    },
    // Using argType here to exclude values from React.HTMLInputTypeAttribute
    type: {
      control: 'select',
      options: [
        'checkbox',
        'date',
        'datetime-local',
        'email',
        'month',
        'number',
        'password',
        'radio',
        'search',
        'tel',
        'text',
        'time',
        'url',
        'week',
        // 'button',
        'color',
        'file',
        // 'hidden',
        // 'image',
        // 'range',
        // 'reset',
        // 'submit',
      ],
    },
  },
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    disabled: false,
    readOnly: false,
    'data-size': 'md',
    multiline: false,
    description: '',
    error: '',
    counter: 0,
  },
};

export const Rows: Story = {
  args: {
    label: 'Label',
    multiline: true,
    rows: 4,
  },
};

export const Affix: Story = {
  args: {
    prefix: 'NOK',
    suffix: 'pr. mnd',
    label: 'Hvor mange kroner koster det per måned?',
  },
};

export const Counter: Story = {
  args: {
    counter: 10,
    label: 'Hvor mange kroner koster det per måned?',
  },
};

export const Controlled: StoryFn<typeof Textfield> = () => {
  const [value, setValue] = useState<string>('');
  return (
    <>
      <Textfield
        label='Kontroller meg!'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <Divider style={{ marginTop: 'var(--ds-spacing-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-spacing-2) 0' }}>
        Du har skrevet inn: {value}
      </Paragraph>
      <Button onClick={() => setValue('Kake')}>Jeg vil ha Kake</Button>
    </>
  );
};
