import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import React, { useState } from 'react';

import { Button, Paragraph } from '../..';

import { Search } from '.';

type Story = StoryObj<typeof Search>;

export default {
  title: 'Felles/Search',
  component: Search,
} as Meta;

export const Preview: Story = {
  args: {
    label: 'Label',
    disabled: false,
    size: 'medium',
    error: '',
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

export const Controlled: StoryFn<typeof Search> = () => {
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
        <Search
          label='Kontroller meg!'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => setValue('Pizza')}>Jeg vil ha Pizza</Button>
      </div>
    </>
  );
};
