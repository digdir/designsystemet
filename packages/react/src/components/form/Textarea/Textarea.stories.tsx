import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { Button, Paragraph } from '../..';

import { Textarea } from '.';

type Story = StoryObj<typeof Textarea>;

export default {
  title: 'Komponenter/Textarea',
  component: Textarea,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    disabled: false,
    readOnly: false,
    size: 'md',
    description: '',
    error: '',
    hideLabel: false,
    cols: 40,
  },
};

export const WithCharacterCounter: Story = {
  args: {
    label: 'Label',
    cols: 40,
    characterLimit: {
      maxCount: 5,
    },
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Label',
    rows: 10,
    cols: 40,
  },
  parameters: {
    layout: 'padded',
  },
};

export const Controlled: StoryFn<typeof Textarea> = () => {
  const [value, setValue] = useState<string>();
  return (
    <>
      <Paragraph>Du har skrevet inn: {value}</Paragraph>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'var(--fds-spacing-2)',
          gap: 'var(--fds-spacing-2)',
        }}
      >
        <Textarea
          label='Kontroller meg!'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          cols={40}
        />
        <Button onClick={() => setValue('Pizza')}>Jeg vil ha Pizza</Button>
      </div>
    </>
  );
};
