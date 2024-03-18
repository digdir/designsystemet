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

export const Adornments: Story = {
  args: {
    label: 'Medium',
    prefix: 'prefix',
    suffix: 'suffix',
  },
};

export const AdornmentsSmall: Story = {
  args: {
    label: 'Small',
    prefix: 'prefix',
    suffix: 'suffix',
    size: 'small',
  },
};

export const AdornmentsLarge: Story = {
  args: {
    label: 'Large',
    prefix: 'prefix',
    suffix: 'suffix',
    size: 'large',
  },
};

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
