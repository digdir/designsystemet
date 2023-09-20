import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import { Button, Paragraph } from '../..';

import { Textfield } from '.';

type Story = StoryObj<typeof Textfield>;

export default {
  title: 'Felles/Textfield',
  component: Textfield,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    disabled: false,
    readOnly: false,
    description: '',
  },
};

export const WithCharacterCounter: Story = {
  args: {
    label: 'Label',
    characterLimit: {
      label: (count) =>
        count > -1
          ? `${count} character Left`
          : `${Math.abs(count)} characters to many.`,
      maxCount: 5,
      srLabel: `Field with room for ${5} characters.`,
    },
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
        <Button onClick={() => setValue('Kake 🎂')}>Jeg vil ha Kake 🎂</Button>
      </div>
    </>
  );
};
