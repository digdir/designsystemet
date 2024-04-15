import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button, Paragraph } from '../..';

import { Textfield } from '.';

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
    size: 'medium',
    description: '',
    error: '',
  },
};

export const WithCharacterCounter: Story = {
  args: {
    label: 'Label',
    characterLimit: {
      maxCount: 5,
    },
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Label',
  },
  parameters: {
    layout: 'padded',
  },
};

export const HtmlSize: Story = {
  args: {
    label: 'Label',
    htmlSize: 10,
  },
};

export const Adornments: StoryFn<typeof Textfield> = () => (
  <div style={{ display: 'grid', gap: 'var(--fds-spacing-2)' }}>
    <Textfield
      prefix='prefix'
      suffix='suffix'
      size='small'
    />
    <Textfield
      prefix='prefix'
      suffix='suffix'
      size='medium'
    />
    <Textfield
      prefix='prefix'
      suffix='suffix'
      size='large'
    />
  </div>
);

export const Controlled: StoryFn<typeof Textfield> = () => {
  const [value, setValue] = useState<string>();
  return (
    <>
      <Paragraph>Du har skrevet inn: {value}</Paragraph>
      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          marginTop: 'var(--fds-spacing-2)',
          gap: 'var(--fds-spacing-2)',
        }}
      >
        <Textfield
          label='Kontroller meg!'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => setValue('Kake')}>Jeg vil ha Kake</Button>
      </div>
    </>
  );
};
