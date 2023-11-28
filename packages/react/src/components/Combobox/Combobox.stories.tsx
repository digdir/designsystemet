import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react';

import { Combobox } from './index';

export default {
  title: 'Felles/Combobox',
  component: Combobox,
} as Meta;

const FRUITS = [
  {
    name: '🍔 Hamburger',
    value: 'hamburger',
  },
  {
    name: '🍕 Pizza',
    value: 'pizza',
  },
  {
    name: '🍣 Sushi',
    value: 'sushi',
  },
  {
    name: '🍜 Nudler',
    value: 'nudler',
  },
  {
    name: '🍝 Pasta',
    value: 'pasta',
  },
  {
    name: '🍟 Pommes frites',
    value: 'pommes_frites',
  },
];

export const Preview: StoryFn<typeof Combobox> = (args) => {
  const [value, setValue] = useState(['']);

  const handleValueChange = (e: string[]) => {
    setValue(e);
  };

  return (
    <>
      <p>Value: {value.map((value) => value)}</p>
      <Combobox
        {...args}
        /* onValueChange={handleValueChange} */
      >
        {FRUITS.map((item, index) => (
          <Combobox.Item
            key={index}
            value={item.value}
          >
            {item.name}
          </Combobox.Item>
        ))}
      </Combobox>
    </>
  );
};

Preview.args = {
  placeholder: 'Velg mat',
  multiple: true,
};
