import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button, Paragraph } from '../..';

import { Input } from '.';

type Story = StoryObj<typeof Input>;

export default {
  title: 'Komponenter/Input',
  component: Input,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    disabled: false,
    readOnly: false,
    size: 'md',
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

export const HtmlSize: Story = {
  args: {
    label: 'Label',
    htmlSize: 10,
  },
};

export const Adornments: Story = {
  args: {
    prefix: 'NOK',
    suffix: 'pr. mnd',
    size: 'md',
    label: 'Hvor mange kroner koster det per måned?',
  },
};

export const Controlled: StoryFn<typeof Input> = () => {
  const [value, setValue] = useState<string>();
  return (
    <>
      <Paragraph>Du har skrevet inn: {value}</Paragraph>
      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          marginTop: 'var(--ds-spacing-2)',
          gap: 'var(--ds-spacing-2)',
        }}
      >
        <Input
          label='Kontroller meg!'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => setValue('Kake')}>Jeg vil ha Kake</Button>
      </div>
    </>
  );
};
