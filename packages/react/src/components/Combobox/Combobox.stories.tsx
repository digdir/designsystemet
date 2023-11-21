import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { data } from './data/data';

import { Combobox } from './index';

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

export const Preview: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState('');

  return (
    <Combobox
      {...args}
      onValueChange={(e) => setValue(e)}
    >
      {data.map((item, index) => (
        <Combobox.Item
          key={index}
          value={item}
        >
          {item}
        </Combobox.Item>
      ))}
    </Combobox>
  );
};
