import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button, Divider, Paragraph, Tag } from '../../';

import { Textfield } from './textfield';

type Story = StoryObj<typeof Textfield>;

export default {
  title: 'Komponenter/Textfield',
  component: Textfield,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    disabled: false,
    readOnly: false,
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
  const [value, setValue] = useState<string>('Ost');
  return (
    <>
      <Textfield
        label='Kontroller meg!'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        counter={5}
      />

      <Divider style={{ marginTop: 'var(--ds-size-4)' }} />

      <Paragraph style={{ margin: 'var(--ds-size-2) 0' }}>
        Du har skrevet inn: {value}
      </Paragraph>
      <Button onClick={() => setValue('Kake')}>Jeg vil ha Kake</Button>
    </>
  );
};

export const Required: Story = {
  args: {
    label: (
      <>
        Hvor bor du? <Tag data-color='warning'>Må fylles ut</Tag>
      </>
    ),
    required: true,
  },
};
